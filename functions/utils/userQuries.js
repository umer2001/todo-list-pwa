const USER_EXISTS = `
query($email: String!) {
    userExists(email: $email)
}`;

const USER_BY_EMAIL = `
query(
  $email: String!
  ) {
  userByEmail(
    email: $email
    ) {
    name
    email
    password
    _id
  }
}`;

const CREATE_USER = `
mutation(
  $name: String!,
  $email: String!,
  $password: String!
  ) {
  createUser(data: {
    name: $name
    email: $email
    password: $password
  }) {
    name
    email
    _id
  }
}`;

module.exports = {
  USER_EXISTS,
  USER_BY_EMAIL,
  CREATE_USER,
};
