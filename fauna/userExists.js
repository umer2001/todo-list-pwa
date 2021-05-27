const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "userExists",
  body: q.Query(
    q.Lambda(
      "email",
      q.Exists(
        q.Match(q.Index("unique_User_email"), q.Casefold(q.Var("email")))
      )
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-04-17T15:00:33.305670Z"),
      meta: {
        location: "Query",
        field: {
          name: "userExists",
          directives: [
            {
              name: "resolver",
              args: { name: "userExists", paginated: false },
            },
          ],
          type: { NotNull: { Named: "Boolean" } },
          arguments: [
            { name: "email", type: { NotNull: { Named: "String" } } },
          ],
        },
      },
    },
  },
};
