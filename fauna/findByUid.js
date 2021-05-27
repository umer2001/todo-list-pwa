const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "findByUid",
  body: q.Query(
    q.Lambda(
      "todoUid",
      q.Map(
        q.Paginate(q.Match(q.Index("findTodoByUid"), q.Var("todoUid"))),
        q.Lambda("x", q.Get(q.Var("x")))
      )
    )
  ),
};
