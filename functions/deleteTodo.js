const { deleteTodo } = require("./utils/todoQueries");
const { parseJsonBody, isNonEmptyString } = require("./utils/db");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
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

    const { id } = parsed.data;
    if (!isNonEmptyString(id)) {
      return formattedResponse(400, { err: "Todo id is required" });
    }

    const deleted = await deleteTodo({
      userId: decoded.id,
      uid: id,
    });

    if (!deleted) {
      return formattedResponse(401, {
        body: "cannot perform this operation",
      });
    }

    return formattedResponse(200, { body: "deleted" });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
