export const addToObject = (stateObject, id, property) => {
  // Create a temp object and index variable
  var temp = {};
  var found = false;
  // Loop through the original object
  for (var prop in stateObject) {
    if (stateObject.hasOwnProperty(prop)) {
      // If the indexes match, add the new item
      if (id < Number(stateObject[prop]._id)) {
        temp[property.uid] = property;
        found = true;
      }
      // Add the current item in the loop to the temp obj
      temp[prop] = stateObject[prop];
    }
  }
  //If no index, add to the end
  if (!found) {
    temp[property.uid] = property;
  }
  return temp;
};

export const displayWhat = (udate) => {
  const dateToday = new Date();
  const testDate = new Date(udate);
  if (
    testDate.getMonth() === dateToday.getMonth() &&
    testDate.getFullYear() === dateToday.getFullYear()
  ) {
    if (testDate.getDate() === dateToday.getDate()) {
      return "Today";
    } else if (testDate.getDate() === dateToday.getDate() - 1) {
      return "Yesterday";
    } else {
      return `${testDate.toLocaleString("default", {
        month: "short",
      })} ${testDate.getDate()}`;
    }
  } else {
    // jan 10
    return `${testDate.toLocaleString("default", {
      month: "short",
    })} ${testDate.getDate()}`;
  }
};

export const displayTime = (udate) => {
  const reminderObj = new Date(udate);
  var hours = reminderObj.getHours();
  var minutes = reminderObj.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutes}${ampm}`;
};

export const createScheduledNotification = async (uid, title, timestamp) => {
  const registration = await window.navigator.serviceWorker.getRegistration();
  console.log(registration);
  registration.showNotification(title, {
    tag: uid,
    body: "Notification from Todo Task",
    showTrigger: new window.TimestampTrigger(+new Date(timestamp)),
    badge: "/paper128x128.png",
    vibrate: [
      500,
      110,
      500,
      110,
      450,
      110,
      200,
      110,
      170,
      40,
      450,
      110,
      200,
      110,
      170,
      40,
      500,
    ],
  });
};
