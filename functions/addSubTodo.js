const { createSubTodo } = require("./utils/todoQueries");
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

    const { newTodo, parentId } = parsed.data;
    if (
      !newTodo ||
      typeof newTodo !== "object" ||
      Array.isArray(newTodo) ||
      !isNonEmptyString(parentId) ||
      !isNonEmptyString(newTodo.todo) ||
      !isNonEmptyString(newTodo.uid)
    ) {
      return formattedResponse(400, {
        err: "Parent id and valid sub-todo data are required",
      });
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
    } = newTodo;

    const createdSubTodo = await createSubTodo({
      userId: decoded.id,
      parentId,
      todo,
      description: typeof description === "string" ? description : "",
      uid,
      status: status !== undefined ? Boolean(status) : true,
      date: date || new Date().toISOString(),
      priority,
      comments,
      reminders,
    });

    if (!createdSubTodo) {
      return formattedResponse(404, {
        err: "Parent todo not found or unauthorized",
      });
    }

    return formattedResponse(200, createdSubTodo);
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
