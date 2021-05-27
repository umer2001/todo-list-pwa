const faunadb = require("faunadb");
const q = faunadb.query;

module.exports = {
  name: "create_sub_todo",
  body: q.Query(
    q.Lambda(
      ["userId", "parentUid", "subTodoData"],
      q.Let(
        {
          parentTodo: q.Select(
            [0, "data"],
            q.Call(q.Function("findByUid"), q.Var("parentUid"))
          ),
          parentTodoId: q.Select(
            [0, "ref", "id"],
            q.Call(q.Function("findByUid"), q.Var("parentUid"))
          ),
          parentSubTodos: q.Select(["subtodos"], q.Var("parentTodo"), []),
          addOwnerToSubTodoData: q.Merge(q.Var("subTodoData"), {
            owner: q.Ref(q.Collection("User"), q.Var("userId")),
          }),
          newSubTodo: q.Create(q.Collection("Todo"), {
            data: q.Var("addOwnerToSubTodoData"),
          }),
          newSubTodoRef: q.Select(["ref"], q.Var("newSubTodo")),
          newParentSubTodoArray: q.Append(
            q.Var("newSubTodoRef"),
            q.Var("parentSubTodos")
          ),
          newParentTodo: q.Merge(q.Var("parentTodo"), {
            subtodos: q.Var("newParentSubTodoArray"),
          }),
          updateresponse: q.Update(
            q.Ref(q.Collection("Todo"), q.Var("parentTodoId")),
            {
              data: q.Var("newParentTodo"),
            }
          ),
        },
        q.Var("newSubTodo")
      )
    )
  ),
  data: {
    gql: {
      ts: q.Time("2021-04-17T15:00:33.305670Z"),
      meta: {
        location: "Mutation",
        field: {
          name: "createSubTodo",
          directives: [
            {
              name: "resolver",
              args: { name: "create_sub_todo", paginated: false },
            },
          ],
          type: { NotNull: { Named: "Todo" } },
          arguments: [
            { name: "userId", type: { NotNull: { Named: "ID" } } },
            { name: "parentId", type: { NotNull: { Named: "ID" } } },
            { name: "newData", type: { NotNull: { Named: "TodoInput" } } },
          ],
        },
      },
    },
  },
};
