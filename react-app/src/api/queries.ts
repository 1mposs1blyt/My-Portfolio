import { gql } from "urql";
export const GET_PORTFOLIO_DATA = gql`
  query GetPortfolioData($lang: Language!) {
    # <-- СТАЛО: Language!
    profile(lang: $lang) {
      name
      headline
      description
      location
      email
      links {
        kind
        label
        url
        order
      }
      skills {
        name
        category
        level
        order
      }
      experience(lang: $lang) {
        company
        position
        description
        startDate
        endDate
        achievements {
          text
          order
        }
      }
      projects(lang: $lang) {
        id
        name
        description
        repoUrl
        liveUrl
        stack
        order
        images {
          url
          order
        }
      }
    }
    reviews(lang: $lang) {
      id
      type
      authorName
      company
      position
      text
      rating
      projectId
    }
  }
`;
