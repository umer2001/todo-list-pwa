const { updateTodo } = require("./utils/todoQueries");
const { parseJsonBody, isNonEmptyString } = require("./utils/db");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return formattedResponse(405, { err: "Method not supported" });
  }

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
      status,
      uid: uId,
      date,
      priority,
      comments,
      reminders,
    } = parsed.data;

    if (!isNonEmptyString(uId) || !isNonEmptyString(todo)) {
      return formattedResponse(400, {
        err: "Todo uid and title are required",
      });
    }

    const updatedTodo = await updateTodo({
      userId: decoded.id,
      uId,
      todo,
      description: typeof description === "string" ? description : "",
      status: status === undefined ? undefined : Boolean(status),
      date,
      priority,
      comments,
      reminders,
    });

    if (!updatedTodo) {
      return formattedResponse(401, {
        err: "cannot perform this operation",
      });
    }

    return formattedResponse(200, updatedTodo);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
