const { createTodo } = require("./utils/todoQueries");
const { parseJsonBody, isNonEmptyString } = require("./utils/db");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  try {
    const decoded = decode(event);
    if (!decoded) {
      return formattedResponse(401, { err: "No Token, can not authorize" });
    }

    const parsed = parseJsonBody(event);
    if (!parsed.ok) {
      return formattedResponse(400, { err: parsed.error });
    }

    const {
      todo,
      description,
      uid,
      status,
      date,
      priority,
      comments,
      reminders,
    } = parsed.data;

    if (!isNonEmptyString(todo) || !isNonEmptyString(uid)) {
      return formattedResponse(400, {
        err: "Todo title and uid are required",
      });
    }

    const createdTodo = await createTodo({
      userId: decoded.id,
      todo,
      description: typeof description === "string" ? description : "",
      uid,
      status: Boolean(status),
      date: date || new Date().toISOString(),
      priority,
      comments,
      reminders,
    });

    return formattedResponse(200, createdTodo);
  } catch (err) {
    if (err && err.code === "23505") {
      return formattedResponse(409, {
        err: "Todo with this uid already exists",
      });
    }
    if (err && err.code === "23503") {
      return formattedResponse(401, {
        err: "User account not found, please sign in again",
      });
    }
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
