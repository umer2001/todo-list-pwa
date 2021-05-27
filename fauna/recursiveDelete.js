const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "recursiveDelete",
  body: q.Query(
    q.Lambda(
      "id",
      q.Let(
        {
          Data: q.Select(
            ["data", "subtodos"],
            q.Get(q.Ref(q.Collection("Todo"), q.Var("id"))),
            []
          ),
        },
        q.Do(
          q.Delete(q.Ref(q.Collection("Todo"), q.Var("id"))),
          q.If(
            q.IsEmpty(q.Var("Data")),
            "",
            q.Foreach(
              q.Var("Data"),
              q.Lambda(
                "dId",
                q.Call(
                  q.Function("recursiveDelete"),
                  q.Select(["id"], q.Var("dId"))
                )
              )
            )
          )
        )
      )
    )
  ),
};
