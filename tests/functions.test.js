const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { splitSqlStatements } = require("../db/migrate");
const {
  normalizePriority,
  normalizeStringArray,
  normalizeDate,
  parseJsonBody,
  isNonEmptyString,
} = require("../functions/utils/db");
const decode = require("../functions/utils/decode");
const signupHandler = require("../functions/signup").handler;
const authHandler = require("../functions/auth").handler;
const updateRemindersHandler = require("../functions/updateRemindersList").handler;

const TEST_SECRET = "unit_test_jwt_secret";

function makeToken(id = "42") {
  return jwt.sign({ id }, TEST_SECRET);
}

describe("db/migrate.js - splitSqlStatements", () => {
  it("parses db/schema.sql without splitting inside DO $$ ... END $$;", () => {
    const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    const statements = splitSqlStatements(schemaSql);

    assert.equal(statements.length, 6);
    assert.ok(statements[0].includes("DO $$"));
    assert.ok(statements[0].includes("CREATE TYPE todo_priority"));
    assert.ok(statements[0].includes("END $$"));
    assert.ok(statements[1].includes("CREATE TABLE IF NOT EXISTS users"));
    assert.ok(statements[2].includes("idx_users_email_lower"));
    assert.ok(statements[3].includes("CREATE TABLE IF NOT EXISTS todos"));
    assert.ok(statements[3].includes("ON DELETE CASCADE"));
    assert.ok(statements[4].includes("idx_todos_user_id"));
    assert.ok(statements[5].includes("idx_todos_parent_uid"));
  });

  it("ignores semicolons inside comments, single-quoted strings, and tagged dollar quotes", () => {
    const trickySql = [
      "-- comment with; semicolon",
      "/* block; comment */",
      "SELECT 'a;b''c';",
      "DO $fn$ BEGIN PERFORM 'x;y'; END $fn$;",
      "-- trailing comment only",
    ].join("\n");
    const statements = splitSqlStatements(trickySql);

    assert.equal(statements.length, 2);
    assert.equal(statements[0], "SELECT 'a;b''c'");
    assert.equal(statements[1], "DO $fn$ BEGIN PERFORM 'x;y'; END $fn$");
  });
});

describe("functions/utils/db.js helpers", () => {
  it("normalizes priority values safely", () => {
    assert.equal(normalizePriority("P1"), "P1");
    assert.equal(normalizePriority("P2"), "P2");
    assert.equal(normalizePriority("P3"), "P3");
    assert.equal(normalizePriority("P4"), "P4");
    assert.equal(normalizePriority("INVALID"), "P4");
    assert.equal(normalizePriority(null), "P4");
    assert.equal(normalizePriority(undefined), "P4");
  });

  it("normalizes string arrays safely", () => {
    assert.deepEqual(normalizeStringArray(["a", "b"]), ["a", "b"]);
    assert.deepEqual(normalizeStringArray(null), []);
    assert.deepEqual(normalizeStringArray(undefined), []);
    assert.deepEqual(normalizeStringArray("not-an-array"), []);
  });

  it("normalizes dates to ISO strings", () => {
    const d = new Date("2026-01-01T00:00:00.000Z");
    assert.equal(normalizeDate(d), "2026-01-01T00:00:00.000Z");
    assert.equal(normalizeDate("2026-01-01"), "2026-01-01");
    assert.ok(!Number.isNaN(Date.parse(normalizeDate(""))));
    assert.ok(!Number.isNaN(Date.parse(normalizeDate(undefined))));
  });

  it("parseJsonBody rejects non-object JSON values (null, arrays, primitives)", () => {
    assert.equal(parseJsonBody({ body: "null" }).ok, false);
    assert.equal(parseJsonBody({ body: "[]" }).ok, false);
    assert.equal(parseJsonBody({ body: '"hello"' }).ok, false);
    assert.equal(parseJsonBody({ body: "123" }).ok, false);
    assert.equal(parseJsonBody({ body: "{bad" }).ok, false);
    assert.deepEqual(parseJsonBody({ body: '{"a":1}' }), { ok: true, data: { a: 1 } });
    assert.deepEqual(parseJsonBody({}), { ok: true, data: {} });
  });

  it("isNonEmptyString rejects non-strings and whitespace-only strings", () => {
    assert.equal(isNonEmptyString("hello"), true);
    assert.equal(isNonEmptyString("   "), false);
    assert.equal(isNonEmptyString(""), false);
    assert.equal(isNonEmptyString(123), false);
    assert.equal(isNonEmptyString(null), false);
  });
});

describe("functions/utils/decode.js", () => {
  const prevSecret = process.env.JWT_SECRET;
  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });
  afterEach(() => {
    process.env.JWT_SECRET = prevSecret;
  });

  it("returns null for missing, null, or invalid tokens", () => {
    assert.equal(decode({}), null);
    assert.equal(decode({ headers: {} }), null);
    assert.equal(decode({ headers: { "x-auth-token": "null" } }), null);
    assert.equal(decode({ headers: { "x-auth-token": "bad.jwt.token" } }), null);
  });

  it("decodes valid lowercase and mixed-case x-auth-token headers", () => {
    const token = makeToken("99");
    assert.equal(decode({ headers: { "x-auth-token": token } }).id, "99");
    assert.equal(decode({ headers: { "X-Auth-Token": token } }).id, "99");
  });

  it("rejects tokens with non-numeric or missing user id", () => {
    const badIdToken = jwt.sign({ id: "not-a-bigint" }, TEST_SECRET);
    const missingIdToken = jwt.sign({ foo: "bar" }, TEST_SECRET);
    assert.equal(decode({ headers: { "x-auth-token": badIdToken } }), null);
    assert.equal(decode({ headers: { "x-auth-token": missingIdToken } }), null);
  });
});

describe("Netlify Functions (with mocked Neon query layer)", () => {
  const prevSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    process.env.JWT_SECRET = prevSecret;
  });

  it("signup & auth & updateRemindersList: reject non-object JSON, non-strings, and whitespace with 400", async () => {
    for (const badBody of ["{bad", "null", "[]", "123"]) {
      const sRes = await signupHandler({ body: badBody });
      assert.equal(sRes.statusCode, 400);
      assert.equal(sRes.headers["Content-Type"], "application/json");

      const aRes = await authHandler({ body: badBody });
      assert.equal(aRes.statusCode, 400);

      const rRes = await updateRemindersHandler({
        httpMethod: "PUT",
        body: badBody,
      });
      assert.equal(rRes.statusCode, 400);
    }

    assert.equal(
      (await signupHandler({ body: JSON.stringify({ email: "a@b.com" }) })).statusCode,
      400
    );
    assert.equal(
      (
        await signupHandler({
          body: JSON.stringify({ name: "   ", email: "a@b.com", password: "abc" }),
        })
      ).statusCode,
      400
    );
    assert.equal(
      (
        await authHandler({
          body: JSON.stringify({ email: 12345, password: "abc" }),
        })
      ).statusCode,
      400
    );
    assert.equal(
      (
        await authHandler({
          body: JSON.stringify({ email: "a@b.com", password: 12345 }),
        })
      ).statusCode,
      400
    );
  });

  it("signup: rejects existing user and Postgres 23505 conflict with 400", async () => {
    const signupPath = require.resolve("../functions/signup");
    const uqPath = require.resolve("../functions/utils/userQueries");
    const origExports = require.cache[uqPath].exports;

    try {
      require.cache[uqPath].exports = {
        ...origExports,
        userExists: async () => true,
      };
      delete require.cache[signupPath];
      const handler = require("../functions/signup").handler;

      const res = await handler({
        body: JSON.stringify({
          name: "Alice",
          email: "alice@example.com",
          password: "secret",
        }),
      });
      assert.equal(res.statusCode, 400);
      assert.ok(JSON.parse(res.body).err.includes("already exists"));

      require.cache[uqPath].exports = {
        ...origExports,
        userExists: async () => false,
        createUser: async () => {
          const err = new Error("duplicate");
          err.code = "23505";
          throw err;
        },
      };
      delete require.cache[signupPath];
      const handler2 = require("../functions/signup").handler;

      const res2 = await handler2({
        body: JSON.stringify({
          name: "Alice",
          email: "alice@example.com",
          password: "secret",
        }),
      });
      assert.equal(res2.statusCode, 400);
    } finally {
      require.cache[uqPath].exports = origExports;
      delete require.cache[signupPath];
    }
  });

  it("signup & auth: creates user with hashed password and authenticates", async () => {
    const signupPath = require.resolve("../functions/signup");
    const authPath = require.resolve("../functions/auth");
    const uqPath = require.resolve("../functions/utils/userQueries");
    const origExports = require.cache[uqPath].exports;

    let storedUser = null;
    try {
      require.cache[uqPath].exports = {
        userExists: async () => Boolean(storedUser),
        createUser: async ({ name, email, passwordHash }) => {
          storedUser = { _id: "7", name, email, password: passwordHash };
          return { _id: "7", name, email };
        },
        getUserByEmail: async (email) =>
          storedUser && storedUser.email === email.toLowerCase()
            ? storedUser
            : null,
      };
      delete require.cache[signupPath];
      delete require.cache[authPath];

      const signup = require("../functions/signup").handler;
      const auth = require("../functions/auth").handler;

      const sRes = await signup({
        body: JSON.stringify({
          name: "Alice",
          email: "alice@example.com",
          password: "my-password",
        }),
      });
      assert.equal(sRes.statusCode, 200);
      const sBody = JSON.parse(sRes.body);
      assert.equal(sBody.user._id, "7");
      assert.equal(jwt.verify(sBody.token, TEST_SECRET).id, "7");
      assert.notEqual(storedUser.password, "my-password");
      assert.ok(await bcrypt.compare("my-password", storedUser.password));

      const badPw = await auth({
        body: JSON.stringify({
          email: "alice@example.com",
          password: "wrong-password",
        }),
      });
      assert.equal(badPw.statusCode, 400);

      const okAuth = await auth({
        body: JSON.stringify({
          email: "alice@example.com",
          password: "my-password",
        }),
      });
      assert.equal(okAuth.statusCode, 200);
      const aBody = JSON.parse(okAuth.body);
      assert.equal(aBody.user.name, "Alice");
      assert.equal(aBody.user._id, "7");
    } finally {
      require.cache[uqPath].exports = origExports;
      delete require.cache[signupPath];
      delete require.cache[authPath];
    }
  });

  it("getTodos, createTodo, addSubTodo, updateTodo, deleteTodo, updateRemindersList contracts", async () => {
    require("../functions/utils/todoQueries");
    const tqPath = require.resolve("../functions/utils/todoQueries");
    const origExports = require.cache[tqPath].exports;
    const fnNames = [
      "../functions/getTodos",
      "../functions/createTodo",
      "../functions/addSubTodo",
      "../functions/updateTodo",
      "../functions/deleteTodo",
      "../functions/updateRemindersList",
    ];

    try {
      require.cache[tqPath].exports = {
        getTodosByUserId: async () => [
          {
            _id: "1",
            uid: "u1",
            todo: "Task 1",
            description: "",
            status: false,
            date: "2026-01-01T00:00:00.000Z",
            priority: "P2",
            comments: ["hi"],
            reminders: [],
            subtodos: [{ uid: "u2" }],
          },
        ],
        createTodo: async (args) => ({
          _id: "2",
          uid: args.uid,
          todo: args.todo,
          date: args.date,
          status: args.status,
        }),
        createSubTodo: async (args) => {
          if (args.parentId === "missing") return null;
          return { _id: "3", uid: args.uid, todo: args.todo };
        },
        updateTodo: async (args) => {
          if (args.uId === "not-mine") return null;
          return { _id: "1", uid: args.uId, todo: args.todo };
        },
        deleteTodo: async (args) => args.uid !== "not-mine",
        removeReminder: async (args) => args.todoUid !== "missing",
      };

      for (const name of fnNames) {
        delete require.cache[require.resolve(name)];
      }

      const getTodos = require("../functions/getTodos").handler;
      const createTodo = require("../functions/createTodo").handler;
      const addSubTodo = require("../functions/addSubTodo").handler;
      const updateTodo = require("../functions/updateTodo").handler;
      const deleteTodo = require("../functions/deleteTodo").handler;
      const updateRemindersList = require("../functions/updateRemindersList").handler;

      const token = makeToken("42");

      // Unauthorized check
      assert.equal((await getTodos({ headers: {} })).statusCode, 401);
      assert.equal((await createTodo({ headers: {}, body: "{}" })).statusCode, 401);
      assert.equal((await addSubTodo({ headers: {}, body: "{}" })).statusCode, 401);
      assert.equal(
        (await updateTodo({ httpMethod: "PUT", headers: {}, body: "{}" })).statusCode,
        401
      );
      assert.equal(
        (await deleteTodo({ httpMethod: "DELETE", headers: {}, body: "{}" })).statusCode,
        401
      );

      // Method enforcement
      assert.equal((await updateTodo({ httpMethod: "POST" })).statusCode, 405);
      assert.equal((await deleteTodo({ httpMethod: "POST" })).statusCode, 405);
      assert.equal((await updateRemindersList({ httpMethod: "POST" })).statusCode, 405);

      // getTodos
      const gRes = await getTodos({ headers: { "x-auth-token": token } });
      assert.equal(gRes.statusCode, 200);
      const gBody = JSON.parse(gRes.body);
      assert.ok(gBody.u1);
      assert.deepEqual(gBody.u1.subtodos, [{ uid: "u2" }]);

      // createTodo
      const cRes = await createTodo({
        headers: { "x-auth-token": token },
        body: JSON.stringify({ uid: "u9", todo: "New Task", priority: "P1" }),
      });
      assert.equal(cRes.statusCode, 200);
      assert.equal(JSON.parse(cRes.body)._id, "2");

      // addSubTodo (missing parent -> 404, valid parent -> 200)
      const s404 = await addSubTodo({
        headers: { "x-auth-token": token },
        body: JSON.stringify({
          parentId: "missing",
          newTodo: { uid: "u10", todo: "Sub" },
        }),
      });
      assert.equal(s404.statusCode, 404);

      const s200 = await addSubTodo({
        headers: { "x-auth-token": token },
        body: JSON.stringify({
          parentId: "u1",
          newTodo: { uid: "u10", todo: "Sub" },
        }),
      });
      assert.equal(s200.statusCode, 200);

      // updateTodo (not owner -> 401, owner -> 200)
      const u401 = await updateTodo({
        httpMethod: "PUT",
        headers: { "x-auth-token": token },
        body: JSON.stringify({ uid: "not-mine", todo: "X" }),
      });
      assert.equal(u401.statusCode, 401);

      const u200 = await updateTodo({
        httpMethod: "PUT",
        headers: { "x-auth-token": token },
        body: JSON.stringify({ uid: "u1", todo: "Updated" }),
      });
      assert.equal(u200.statusCode, 200);

      // deleteTodo (not owner -> 401, owner -> 200)
      const d401 = await deleteTodo({
        httpMethod: "DELETE",
        headers: { "x-auth-token": token },
        body: JSON.stringify({ id: "not-mine" }),
      });
      assert.equal(d401.statusCode, 401);

      const d200 = await deleteTodo({
        httpMethod: "DELETE",
        headers: { "x-auth-token": token },
        body: JSON.stringify({ id: "u1" }),
      });
      assert.equal(d200.statusCode, 200);
      assert.deepEqual(JSON.parse(d200.body), { body: "deleted" });

      // updateRemindersList
      const r404 = await updateRemindersList({
        httpMethod: "PUT",
        body: JSON.stringify({ uid: "missing", reminder: "2026-01-01" }),
      });
      assert.equal(r404.statusCode, 404);

      const r200 = await updateRemindersList({
        httpMethod: "PUT",
        body: JSON.stringify({ uid: "u1", reminder: "2026-01-01" }),
      });
      assert.equal(r200.statusCode, 200);
      assert.deepEqual(JSON.parse(r200.body), { updateRemindersList: "ok" });
      // createTodo duplicate uid (23505 -> 409) and stale user_id FK (23503 -> 401)
      require.cache[tqPath].exports.createTodo = async () => {
        const err = new Error("duplicate uid");
        err.code = "23505";
        throw err;
      };
      delete require.cache[require.resolve("../functions/createTodo")];
      const createTodoDup = require("../functions/createTodo").handler;
      assert.equal(
        (
          await createTodoDup({
            headers: { "x-auth-token": token },
            body: JSON.stringify({ uid: "u9", todo: "Dup" }),
          })
        ).statusCode,
        409
      );

      require.cache[tqPath].exports.createTodo = async () => {
        const err = new Error("fk violation");
        err.code = "23503";
        throw err;
      };
      delete require.cache[require.resolve("../functions/createTodo")];
      const createTodoFk = require("../functions/createTodo").handler;
      assert.equal(
        (
          await createTodoFk({
            headers: { "x-auth-token": token },
            body: JSON.stringify({ uid: "u9", todo: "Stale JWT" }),
          })
        ).statusCode,
        401
      );
    } finally {
      require.cache[tqPath].exports = origExports;
      for (const name of fnNames) {
        delete require.cache[require.resolve(name)];
      }
    }
  });

  it("todoQueries: verifies single-statement createSubTodo and COALESCE status/date preservation in updateTodo", async () => {
    const prevUrl = process.env.DATABASE_URL;
    const origFetch = globalThis.fetch;
    const capturedRequests = [];

    try {
      process.env.DATABASE_URL = "postgresql://u:p@ep-test.us-east-2.aws.neon.tech/neondb";
      globalThis.fetch = async (url, opts) => {
        capturedRequests.push(JSON.parse(opts.body));
        const wireBody = {
          rows: [["10", "u2", "Sub"]],
          fields: [
            { name: "_id", dataTypeID: 25 },
            { name: "uid", dataTypeID: 25 },
            { name: "todo", dataTypeID: 25 },
          ],
          rowCount: 1,
        };
        return {
          ok: true,
          status: 200,
          headers: new Headers(),
          json: async () => wireBody,
          text: async () => JSON.stringify(wireBody),
        };
      };

      const { createSubTodo, updateTodo } = require("../functions/utils/todoQueries");

      const created = await createSubTodo({
        userId: "42",
        parentId: "u1",
        uid: "u2",
        todo: "Sub",
        priority: "P2",
        comments: ["c1"],
        reminders: [],
      });
      assert.deepEqual(created, { _id: "10", uid: "u2", todo: "Sub" });
      assert.equal(capturedRequests.length, 1, "createSubTodo should execute in 1 atomic SQL query");
      assert.ok(capturedRequests[0].query.includes("FROM todos p"));

      await updateTodo({
        userId: "42",
        uId: "u2",
        todo: "Updated Sub",
        priority: "P1",
        comments: ["c1"],
        reminders: [],
      });
      assert.equal(capturedRequests.length, 2);
      assert.ok(capturedRequests[1].query.includes("COALESCE("));
      assert.equal(capturedRequests[1].params[2], null, "omitted status should pass null to COALESCE");
      assert.equal(capturedRequests[1].params[3], null, "omitted date should pass null to COALESCE");
    } finally {
      globalThis.fetch = origFetch;
      process.env.DATABASE_URL = prevUrl;
    }
  });
});
