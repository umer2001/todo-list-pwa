const { DELETE_TODO, DELETE_SUB_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");
const decode = require("./utils/decode");

exports.handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return formattedResponse(405, { err: "Method not supported" });
  }
  try {
    // check & decode auth token
    const decoded = decode(event);
    if (!decoded) {
      formattedResponse(401, { err: "No Token, can not authorize" });
    }

    console.log(decoded);
    const { id, parentId } = JSON.parse(event.body);
    console.log(`got :  ${id}\tparent id : ${parentId}`);

    var data;
    if (parentId) {
      data = await sendQuery(DELETE_SUB_TODO, {
        userId: decoded.id,
        uid: id,
        parentUid: parentId,
      });
    } else {
      data = await sendQuery(DELETE_TODO, {
        userId: decoded.id,
        uid: id,
      });
    }
    const { statusCode, msg } = JSON.parse(data.deleteTodo);

    return formattedResponse(statusCode, { body: msg });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
