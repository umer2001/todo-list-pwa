const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "updateTodo",
  body: q.Query(
    q.Lambda(
      ["userId", "todoUid", "newTodoData"],
      q.If(
        q.Call(q.Function("canOperate"), [q.Var("userId"), q.Var("todoUid")]),
        q.Let(
          {
            todoId: q.Select(
              [0, "ref", "id"],
              q.Call(q.Function("findByUid"), q.Var("todoUid"))
            ),
          },
          q.Update(q.Ref(q.Collection("Todo"), q.Var("todoId")), {
            data: q.Var("newTodoData"),
          })
        ),
        '{ statusCode: "401", error: "can not perform this operation" }'
      )
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-04-17T15:00:33.305670Z"),
      meta: {
        location: "Mutation",
        field: {
          name: "updateTodo",
          directives: [
            {
              name: "resolver",
              args: { name: "updateTodo", paginated: false },
            },
          ],
          type: { Named: "Todo", NotNull: { Named: "Todo" } },
          arguments: [
            { name: "userId", type: { NotNull: { Named: "ID" } } },
            { name: "uId", type: { NotNull: { Named: "ID" } } },
            { name: "data", type: { NotNull: { Named: "TodoInput" } } },
          ],
        },
      },
    },
  },
};
