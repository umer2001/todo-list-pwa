const faunadb = require("faunadb");
require("dotenv").config();

const faunaFunctions = [
  require("./canOperate"),
  require("./create_sub_todo"),
  require("./createTodo"),
  require("./deleteTodo"),
  require("./findByUid"),
  require("./recursiveDelete"),
  require("./todosByUserId"),
  require("./updateRemindersList"),
  require("./updateTodo"),
  require("./userByEmail"),
  require("./userExists"),
];

const client = new faunadb.Client({
  secret: process.env.FAUNA_DB_SECRET,
});

const q = faunadb.query;

faunaFunctions.forEach((faunaFunction) => {
  client
    .query(q.CreateFunction(faunaFunction))
    .then(({ name }) => console.log(`${name} success`))
    .catch((err) => console.error("Error: %s", err));
});
