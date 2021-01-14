const CREATE_TODO = `
mutation(
        $todo: String!,
        $description: String!,
        $status: Boolean!,
        $date:  String!,
        $uid:  ID!,
        $priority: Priority,
        $subtodos: [ID!],
        $comments: [String!],
        $reminders: [String!]
    ) {
    createTodo(data: {
        todo: $todo,
        description: $description,
        status: $status,
        date: $date,
        uid: $uid,
        priority: $priority,
        subtodos: $subtodos,
        comments: $comments,
        reminders: $reminders 
     }) {
      todo
      date
      status
      _id
    }
}`;

const GET_ALLTODOS = `
query {
    allTodos {
      data {
        todo
        date
        status
        _id
        priority
        description
        subtodos {
          _id
        }
        comments
        reminders
      }
    }
}`;

const DELETE_TODO = `
mutation($id: ID!) {
    deleteTodo(id: $id) {
        todo
        _id
    }
}`;

module.exports = {
  CREATE_TODO,
  GET_ALLTODOS,
  DELETE_TODO,
};
