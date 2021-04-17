const CREATE_TODO = `
mutation(
        $userId: ID!,
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
    createTodo(userId: $userId, data: {
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

const GET_TODOS_BY_USER_ID = `
query($userId: ID!) {
  todosByUserId(userId: $userId) {
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
}`;

const UPDATE_TODO = `
mutation(
    $userId: ID!,
    $uId: ID!,
    $todo: String!,
    $description: String!,
    $status: Boolean!,
    $date:  String!,
    $priority: Priority,
    $comments: [String!],
    $reminders: [String!]
  ) {
      updateTodo(userId: $userId, uId: $uId, data: {
      todo: $todo,
      description: $description,
      status: $status,
      date: $date,
      uid: $uId,
      priority: $priority,
      comments: $comments,
      reminders: $reminders 
    }) {
      _id
      todo
    }
}`;

const DELETE_TODO = `
mutation($userId: ID!, $uid: ID!) {
  deleteTodo(userId: $userId, uId: $uid)
}`;

const DELETE_SUB_TODO = `
mutation($userId: ID!, $uid: ID!, $parentUid: ID) {
  deleteTodo(userId: $userId, uId: $uid, parentId: $parentUid)
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
          $userId: ID!,
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
          userId: $userId,
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

const UPDATE_REMINDERS_LIST = `
mutation(
  $todoUid: ID!
  $reminder: String!
) {
  updateRemindersList(todoUid: $todoUid, reminder: $reminder) 
}`;

module.exports = {
  CREATE_TODO,
  CREATE_SUB_TODO,
  GET_ALLTODOS,
  GET_TODOS_BY_USER_ID,
  UPDATE_TODO,
  DELETE_TODO,
  DELETE_SUB_TODO,
  GET_TODO_BY_ID,
  UPDATE_REMINDERS_LIST,
};
