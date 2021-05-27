const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "canOperate",
  body: q.Query(
    q.Lambda(
      ["userId", "todoUid"],
      q.Let(
        {
          arrayWithRef: q.Paginate(
            q.Match(q.Index("findTodoByUid"), q.Var("todoUid"))
          ),
          ref: q.Select(["data", 0], q.Var("arrayWithRef")),
          todoData: q.Get(q.Var("ref")),
          ownerId: q.Select(["data", "owner", "id"], q.Var("todoData")),
          result: q.Equals(q.Var("userId"), q.Var("ownerId")),
        },
        q.Var("result")
      )
    )
  ),
};
