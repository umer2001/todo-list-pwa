const {
  getDb,
  normalizePriority,
  normalizeStringArray,
  normalizeDate,
} = require("./db");

async function getTodosByUserId(userId) {
  const sql = getDb();
  const rows = await sql`
    SELECT
      t.id::text AS "_id",
      t.uid,
      t.todo,
      t.description,
      t.status,
      t.date,
      t.priority,
      t.comments,
      t.reminders,
      COALESCE(
        (
          SELECT json_agg(json_build_object('uid', c.uid) ORDER BY c.id ASC)
          FROM todos c
          WHERE c.parent_uid = t.uid AND c.user_id = t.user_id
        ),
        '[]'::json
      ) AS subtodos
    FROM todos t
    WHERE t.user_id = ${userId}
    ORDER BY t.id ASC
  `;
  return rows;
}

async function createTodo({
  userId,
  todo,
  description = "",
  status = false,
  date,
  uid,
  priority,
  comments,
  reminders,
}) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO todos (
      user_id,
      parent_uid,
      uid,
      todo,
      description,
      status,
      date,
      priority,
      comments,
      reminders
    )
    VALUES (
      ${userId},
      NULL,
      ${uid},
      ${todo},
      ${description || ""},
      ${Boolean(status)},
      ${normalizeDate(date)},
      ${normalizePriority(priority)}::todo_priority,
      ${normalizeStringArray(comments)}::text[],
      ${normalizeStringArray(reminders)}::text[]
    )
    RETURNING id::text AS "_id", uid, todo, date, status
  `;
  return rows[0];
}

async function createSubTodo({
  userId,
  parentId,
  todo,
  description = "",
  status = true,
  date,
  uid,
  priority,
  comments,
  reminders,
}) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO todos (
      user_id,
      parent_uid,
      uid,
      todo,
      description,
      status,
      date,
      priority,
      comments,
      reminders
    )
    SELECT
      ${userId},
      p.uid,
      ${uid},
      ${todo},
      ${description || ""},
      ${Boolean(status)},
      ${normalizeDate(date)},
      ${normalizePriority(priority)}::todo_priority,
      ${normalizeStringArray(comments)}::text[],
      ${normalizeStringArray(reminders)}::text[]
    FROM todos p
    WHERE p.uid = ${parentId} AND p.user_id = ${userId}
    LIMIT 1
    RETURNING id::text AS "_id", uid, todo
  `;
  return rows[0] || null;
}

async function updateTodo({
  userId,
  uId,
  todo,
  description = "",
  status,
  date,
  priority,
  comments,
  reminders,
}) {
  const sql = getDb();
  const normalizedStatus =
    status === undefined || status === null ? null : Boolean(status);
  const normalizedDate =
    date instanceof Date
      ? date.toISOString()
      : typeof date === "string" && date.trim() !== ""
      ? date
      : null;

  const rows = await sql`
    UPDATE todos
    SET
      todo = ${todo},
      description = ${description || ""},
      status = COALESCE(${normalizedStatus}, status),
      date = COALESCE(${normalizedDate}, date),
      priority = ${normalizePriority(priority)}::todo_priority,
      comments = ${normalizeStringArray(comments)}::text[],
      reminders = ${normalizeStringArray(reminders)}::text[]
    WHERE uid = ${uId} AND user_id = ${userId}
    RETURNING id::text AS "_id", uid, todo
  `;
  return rows[0] || null;
}

async function deleteTodo({ userId, uid }) {
  const sql = getDb();
  const rows = await sql`
    DELETE FROM todos
    WHERE uid = ${uid} AND user_id = ${userId}
    RETURNING uid
  `;
  return rows.length > 0;
}

async function removeReminder({ todoUid, reminder }) {
  const sql = getDb();
  const rows = await sql`
    UPDATE todos
    SET reminders = array_remove(reminders, ${reminder})
    WHERE uid = ${todoUid}
    RETURNING uid
  `;
  return rows.length > 0;
}

module.exports = {
  getTodosByUserId,
  createTodo,
  createSubTodo,
  updateTodo,
  deleteTodo,
  removeReminder,
};

