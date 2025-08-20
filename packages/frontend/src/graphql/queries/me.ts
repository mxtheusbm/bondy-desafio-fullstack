import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      company
      email
      name
      password
    }
  }
`;
