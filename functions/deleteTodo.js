const { DELETE_TODO, DELETE_SUB_TODO } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event, context, callback) => {
  try {
    const { id, parentId } = JSON.parse(event.body);
    console.log(`got :  ${id}\tparent id : ${parentId}`);
    // if sub delete refrence from parent

    var data;
    if (parentId) {
      data = await sendQuery(DELETE_SUB_TODO, {
        uid: id,
        parentUid: parentId,
      });
    } else {
      data = await sendQuery(DELETE_TODO, {
        uid: id,
      });
    }
    return formattedResponse(200, { body: "deleting..." });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
