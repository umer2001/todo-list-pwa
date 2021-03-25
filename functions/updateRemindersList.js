const { UPDATE_REMINDERS_LIST } = require("./utils/todoQuries");
const sendQuery = require("./utils/sendQuries");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return formattedResponse(405, { err: "Method not supported" });
  }
  console.log(event.body);
  const { uid, reminder } = JSON.parse(event.body);
  const variables = {
    todoUid: uid,
    reminder,
  };
  try {
    const res = await sendQuery(UPDATE_REMINDERS_LIST, variables);
    return formattedResponse(200, res);
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
