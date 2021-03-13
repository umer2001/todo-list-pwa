const CREATE_TODO = `
mutation(
        $todo: String!,
        $description: String!,
        $status: Boolean!,
        $date:  String!,
        $uid:  ID!,
        $priority: Priority,
        $subtodos: [TodoInput!],
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
        uid
        priority
        description
        subtodos {
          uid
        }
        comments
        reminders
      }
    }
}`;

const UPDATE_TODO = `
mutation(
    $id: ID!,
    $todo: String!,
    $description: String!,
    $status: Boolean!,
    $date:  String!,
    $uid:  ID!,
    $priority: Priority,
    $subtodos: [TodoInput!],
    $comments: [String!],
    $reminders: [String!]
  ) {
      updateTodo(id: $id, data: {
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
      _id
      todo
    }
}`;

const DELETE_TODO = `
mutation($uid: ID!) {
  deleteTodo(id: $uid) {
    todo
    _id
  }
}`;

const DELETE_SUB_TODO = `
mutation($uid: ID!, $parentUid: ID) {
  deleteTodo(id: $uid, parentId: $parentUid) {
    uid
  }
}`;

const GET_TODO_BY_ID = `
query($id: ID!) {
  findTodoByID(id: $id) {
    todo
    description
    status
    uid
    date
    reminders
    comments
    subtodos {
      _id
    }
  }
}`;

const CREATE_SUB_TODO = `
mutation(
          $parentId: ID!,
          $todo: String!,
          $description: String!,
          $status: Boolean!,
          $date:  String!,
          $uid:  ID!,
          $priority: Priority,
          $subtodos: [TodoInput!],
          $comments: [String!],
          $reminders: [String!]
        ) {
        createSubTodo(
          parentId: $parentId,
          newData: {
            todo: $todo,
            description: $description,
            status: $status,
            date: $date,
            uid: $uid,
            priority: $priority,
            subtodos: $subtodos,
            comments: $comments,
            reminders: $reminders
          }
        ) {
            todo
            uid
            _id
          }
}`;
module.exports = {
  CREATE_TODO,
  CREATE_SUB_TODO,
  GET_ALLTODOS,
  UPDATE_TODO,
  DELETE_TODO,
  DELETE_SUB_TODO,
  GET_TODO_BY_ID,
};
