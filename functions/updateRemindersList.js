const { removeReminder } = require("./utils/todoQueries");
const { parseJsonBody, isNonEmptyString } = require("./utils/db");
const formattedResponse = require("./utils/formattedResponse");

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return formattedResponse(405, { err: "Method not supported" });
  }

  const parsed = parseJsonBody(event);
  if (!parsed.ok) {
    return formattedResponse(400, { err: parsed.error });
  }

  const { uid, reminder } = parsed.data;
  if (!isNonEmptyString(uid) || !isNonEmptyString(reminder)) {
    return formattedResponse(400, {
      err: "Todo uid and reminder are required",
    });
  }

  try {
    const updated = await removeReminder({
      todoUid: uid,
      reminder,
    });

    if (!updated) {
      return formattedResponse(404, { err: "Todo not found" });
    }

    return formattedResponse(200, { updateRemindersList: "ok" });
  } catch (err) {
    console.error(err);
    return formattedResponse(500, { err: "Something went wrong" });
  }
};
