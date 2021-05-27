const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "todosByUserId",
  body: q.Query(
    q.Lambda(
      ["userId"],
      q.Let(
        {
          refs: q.Select(
            "data",
            q.Map(
              q.Paginate(
                q.Match(
                  q.Index("todo_owner_by_user"),
                  q.Ref(q.Collection("User"), q.Var("userId"))
                )
              ),
              q.Lambda("x", q.Get(q.Var("x")))
            ),
            []
          ),
        },
        q.Var("refs")
      )
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-04-17T15:00:33.305670Z"),
      meta: {
        location: "Query",
        field: {
          name: "todosByUserId",
          directives: [
            {
              name: "resolver",
              args: { name: "todosByUserId", paginated: false },
            },
          ],
          type: { NotNull: { List: { NotNull: { Named: "Todo" } } } },
          arguments: [{ name: "userId", type: { NotNull: { Named: "ID" } } }],
        },
      },
    },
  },
};
