import gql from 'graphql-tag'

export default gql`
  type User {
    name: String!
    email: String!
    company: String
    password: String!
  }

  type Mutation {
    login(email: String!, password: String!): User
  }
`
