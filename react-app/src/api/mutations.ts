import { gql } from "urql";
export const SUBMIT_REVIEW_MUTATION = gql`
  mutation SubmitReview($input: CreateReviewInput!) {
    submitReview(input: $input) {
      id
      authorName
    }
  }
`;
export const VALIDATE_TOKEN_QUERY = gql`
  query ValidateReviewToken($token: String!) {
    validateReviewToken(token: $token) {
      isValid
      type
      projectName
    }
  }
`;
