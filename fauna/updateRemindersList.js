const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "updateRemindersList",
  body: q.Query(
    q.Lambda(
      ["todoUid", "reminder"],
      q.Let(
        {
          todo: q.Call(q.Function("findByUid"), q.Var("todoUid")),
          todoData: q.Select([0, "data"], q.Var("todo")),
          todoId: q.Select([0, "ref", "id"], q.Var("todo")),
          todoReminders: q.Select(["reminders"], q.Var("todoData"), []),
          updatedTodoReminders: q.Difference(q.Var("todoReminders"), [
            q.Var("reminder"),
          ]),
          newTodo: q.Merge(q.Var("todoData"), {
            reminders: q.Var("updatedTodoReminders"),
          }),
          updateresponse: q.Update(
            q.Ref(q.Collection("Todo"), q.Var("todoId")),
            {
              data: q.Var("newTodo"),
            }
          ),
        },
        "ok"
      )
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-03-21T13:26:44.387739Z"),
      meta: {
        location: "Mutation",
        field: {
          name: "updateRemindersList",
          directives: [
            {
              name: "resolver",
              args: { name: "updateRemindersList", paginated: false },
            },
          ],
          type: { NotNull: { Named: "String" } },
          arguments: [
            { name: "todoUid", type: { NotNull: { Named: "ID" } } },
            { name: "reminder", type: { NotNull: { Named: "String" } } },
          ],
        },
      },
    },
  },
};
