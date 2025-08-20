import gql from 'graphql-tag'

export default gql`
  type User {
    name: String!
    email: String!
    company: String
    password: String!
  }

  type LoginResponse {
    token: String
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse
  }
`
