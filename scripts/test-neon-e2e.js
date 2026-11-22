/**
 * Live end-to-end integration test against Neon PostgreSQL.
 * Runs all 8 Netlify Functions against process.env.DATABASE_URL
 * and cleans up the test user(s) when finished.
 */
const assert = require("assert");
require("dotenv").config();

const { migrate } = require("../db/migrate");
const { getDb } = require("../functions/utils/db");

const signup = require("../functions/signup").handler;
const auth = require("../functions/auth").handler;
const getTodos = require("../functions/getTodos").handler;
const createTodo = require("../functions/createTodo").handler;
const addSubTodo = require("../functions/addSubTodo").handler;
const updateTodo = require("../functions/updateTodo").handler;
const updateRemindersList = require("../functions/updateRemindersList").handler;
const deleteTodo = require("../functions/deleteTodo").handler;

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL must be set to run Neon E2E tests.");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "e2e_test_jwt_secret";
  }

  await migrate();

  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const emailA = `e2e-a-${suffix}@example.com`;
  const emailB = `e2e-b-${suffix}@example.com`;
  const password = "TestPassword123!";
  const sql = getDb();

  try {
    // 1. Signup User A
    const signupRes = await signup({
      httpMethod: "POST",
      body: JSON.stringify({ name: "User A", email: emailA, password }),
    });
    assert.strictEqual(signupRes.statusCode, 200, `Signup failed: ${signupRes.body}`);
    const signupBody = JSON.parse(signupRes.body);
    assert.ok(signupBody.token);
    assert.strictEqual(signupBody.user.email, emailA);
    assert.ok(/^\d+$/.test(signupBody.user._id), "_id should be numeric string");

    // 2. Duplicate signup (case-insensitive)
    const dupRes = await signup({
      httpMethod: "POST",
      body: JSON.stringify({ name: "User A", email: emailA.toUpperCase(), password }),
    });
    assert.strictEqual(dupRes.statusCode, 400);

    // 3. Signin User A (wrong password then right password)
    const badAuth = await auth({
      httpMethod: "POST",
      body: JSON.stringify({ email: emailA, password: "wrong" }),
    });
    assert.strictEqual(badAuth.statusCode, 400);

    const authRes = await auth({
      httpMethod: "POST",
      body: JSON.stringify({ email: emailA.toUpperCase(), password }),
    });
    assert.strictEqual(authRes.statusCode, 200);
    const { token: tokenA } = JSON.parse(authRes.body);

    // Signup User B for cross-user authorization checks
    const signupB = await signup({
      httpMethod: "POST",
      body: JSON.stringify({ name: "User B", email: emailB, password }),
    });
    assert.strictEqual(signupB.statusCode, 200);
    const { token: tokenB } = JSON.parse(signupB.body);

    // 4. Create parent todo
    const parentUid = `uid-parent-${suffix}`;
    const reminder1 = "2026-12-01T10:00:00.000Z";
    const reminder2 = "2026-12-02T10:00:00.000Z";
    const createRes = await createTodo({
      httpMethod: "POST",
      headers: { "x-auth-token": tokenA },
      body: JSON.stringify({
        uid: parentUid,
        todo: "Parent Task",
        description: "desc",
        status: false,
        priority: "P2",
        comments: ["Initial comment"],
        reminders: [reminder1, reminder2],
      }),
    });
    assert.strictEqual(createRes.statusCode, 200);

    // 5. Add sub-todo + nested sub-sub-todo
    const childUid = `uid-child-${suffix}`;
    const grandChildUid = `uid-grandchild-${suffix}`;
    const subRes = await addSubTodo({
      httpMethod: "POST",
      headers: { "x-auth-token": tokenA },
      body: JSON.stringify({
        parentId: parentUid,
        newTodo: {
          uid: childUid,
          todo: "Child Task",
          status: true,
          priority: "P3",
          comments: [],
          reminders: [],
        },
      }),
    });
    assert.strictEqual(subRes.statusCode, 200);

    const grandSubRes = await addSubTodo({
      httpMethod: "POST",
      headers: { "x-auth-token": tokenA },
      body: JSON.stringify({
        parentId: childUid,
        newTodo: {
          uid: grandChildUid,
          todo: "Grandchild Task",
          status: true,
          priority: "P4",
          comments: [],
          reminders: [],
        },
      }),
    });
    assert.strictEqual(grandSubRes.statusCode, 200);

    // 6. Get todos and verify structure
    const getRes = await getTodos({
      httpMethod: "GET",
      headers: { "x-auth-token": tokenA },
    });
    assert.strictEqual(getRes.statusCode, 200);
    const todosMap = JSON.parse(getRes.body);
    assert.ok(todosMap[parentUid]);
    assert.ok(todosMap[childUid]);
    assert.ok(todosMap[grandChildUid]);
    assert.deepStrictEqual(todosMap[parentUid].subtodos, [{ uid: childUid }]);
    assert.deepStrictEqual(todosMap[childUid].subtodos, [{ uid: grandChildUid }]);
    assert.deepStrictEqual(todosMap[grandChildUid].subtodos, []);

    // 7. Update todo (User A succeeds, User B is rejected with 401)
    const crossUpdate = await updateTodo({
      httpMethod: "PUT",
      headers: { "x-auth-token": tokenB },
      body: JSON.stringify({
        uid: parentUid,
        todo: "Hacked",
        status: false,
        priority: "P1",
        comments: [],
        reminders: [],
      }),
    });
    assert.strictEqual(crossUpdate.statusCode, 401);

    const updateRes = await updateTodo({
      httpMethod: "PUT",
      headers: { "x-auth-token": tokenA },
      body: JSON.stringify({
        uid: parentUid,
        todo: "Parent Task Updated",
        status: false,
        date: todosMap[parentUid].date,
        priority: "P1",
        comments: ["Initial comment", "Second comment"],
        reminders: [reminder1, reminder2],
      }),
    });
    assert.strictEqual(updateRes.statusCode, 200);

    // 8. Remove reminder via updateRemindersList
    const remRes = await updateRemindersList({
      httpMethod: "PUT",
      body: JSON.stringify({ uid: parentUid, reminder: reminder1 }),
    });
    assert.strictEqual(remRes.statusCode, 200);

    const afterRem = JSON.parse(
      (await getTodos({ httpMethod: "GET", headers: { "x-auth-token": tokenA } })).body
    );
    assert.deepStrictEqual(afterRem[parentUid].reminders, [reminder2]);
    assert.strictEqual(afterRem[parentUid].priority, "P1");
    assert.strictEqual(afterRem[parentUid].comments.length, 2);

    // 9. Cross-user delete denied, owner delete cascades recursively
    const crossDelete = await deleteTodo({
      httpMethod: "DELETE",
      headers: { "x-auth-token": tokenB },
      body: JSON.stringify({ id: parentUid }),
    });
    assert.strictEqual(crossDelete.statusCode, 401);

    const delRes = await deleteTodo({
      httpMethod: "DELETE",
      headers: { "x-auth-token": tokenA },
      body: JSON.stringify({ id: parentUid }),
    });
    assert.strictEqual(delRes.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(delRes.body), { body: "deleted" });

    const afterDel = JSON.parse(
      (await getTodos({ httpMethod: "GET", headers: { "x-auth-token": tokenA } })).body
    );
    assert.deepStrictEqual(afterDel, {}, "Recursive cascade delete should remove parent + children");

    console.log("ALL NEON E2E TESTS PASSED!");
  } finally {
    await sql`DELETE FROM users WHERE email IN (${emailA}, ${emailB})`;
  }
}

run().catch((err) => {
  console.error("Neon E2E test failed:", err);
  process.exit(1);
});

