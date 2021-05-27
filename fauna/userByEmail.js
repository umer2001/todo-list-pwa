const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "userByEmail",
  body: q.Query(
    q.Lambda(
      "email",
      q.Get(q.Match(q.Index("unique_User_email"), q.Var("email")))
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-04-17T17:11:12.752973Z"),
      meta: {
        location: "Query",
        field: {
          name: "userByEmail",
          directives: [
            {
              name: "resolver",
              args: { name: "userByEmail", paginated: false },
            },
          ],
          type: { NotNull: { Named: "User" } },
          arguments: [
            { name: "email", type: { NotNull: { Named: "String" } } },
          ],
        },
      },
    },
  },
};
