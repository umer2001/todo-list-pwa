const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "createTodo",
  body: q.Query(
    q.Lambda(
      ["userId", "TodoData"],
      q.Let(
        {
          addOwnerToData: q.Merge(q.Var("TodoData"), {
            owner: q.Ref(q.Collection("User"), q.Var("userId")),
          }),
          newTodo: q.Create(q.Collection("Todo"), {
            data: q.Var("addOwnerToData"),
          }),
        },
        q.Var("newTodo")
      )
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-04-17T15:00:33.305670Z"),
      meta: {
        location: "Mutation",
        field: {
          name: "createTodo",
          directives: [
            {
              name: "resolver",
              args: { name: "createTodo", paginated: false },
            },
          ],
          type: { NotNull: { Named: "Todo" } },
          arguments: [
            { name: "userId", type: { NotNull: { Named: "ID" } } },
            { name: "data", type: { NotNull: { Named: "TodoInput" } } },
          ],
        },
      },
    },
  },
};
