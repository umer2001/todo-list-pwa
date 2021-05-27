const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "deleteTodo",
  body: q.Query(
    q.Lambda(
      ["userId", "uId", "parentUid"],
      q.Let(
        {
          todoId: q.Select(
            ["data", 0, "ref", "id"],
            q.Call(q.Function("findByUid"), q.Var("uId"))
          ),
          parentTodoId: q.Select(
            ["data", 0, "ref", "id"],
            q.Call(q.Function("findByUid"), [q.Var("parentUid")]),
            0
          ),
        },
        q.If(
          q.Call(q.Function("canOperate"), [q.Var("userId"), q.Var("uId")]),
          q.If(
            q.Equals(q.Var("parentTodoId"), 0),
            q.Do(
              q.Call(q.Function("recursiveDelete"), q.Var("todoId")),
              '{ "statusCode": 200, "msg": "deleted"}'
            ),
            q.Let(
              {
                parentData: q.Select(
                  ["data"],
                  q.Get(q.Ref(q.Collection("Todo"), q.Var("parentTodoId")))
                ),
                parentSubTodos: q.Select(["subtodos"], q.Var("parentData"), []),
                updatedSubTodosArray: q.Difference(q.Var("parentSubTodos"), [
                  q.Ref(q.Collection("Todo"), q.Var("todoId")),
                ]),
              },
              q.Do(
                q.Update(q.Ref(q.Collection("Todo"), q.Var("parentTodoId")), {
                  data: q.Merge(q.Var("parentData"), {
                    subtodos: q.Var("updatedSubTodosArray"),
                  }),
                }),
                q.Call(q.Function("recursiveDelete"), q.Var("todoId")),
                '{ "statusCode": 200, "msg": "deleted"}'
              )
            )
          ),
          '{ "statusCode": 401, "msg": "cannot perform this operation" }'
        )
      )
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-04-17T15:00:33.305670Z"),
      meta: {
        location: "Mutation",
        field: {
          name: "deleteTodo",
          directives: [
            {
              name: "resolver",
              args: { name: "deleteTodo", paginated: false },
            },
          ],
          type: { NotNull: { Named: "String" } },
          arguments: [
            { name: "userId", type: { NotNull: { Named: "ID" } } },
            { name: "id", type: { NotNull: { Named: "ID" } } },
            { name: "parentId", type: { Named: "ID" } },
          ],
        },
      },
    },
  },
};
