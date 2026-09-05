import { gql } from "urql";

export const GET_PORTFOLIO_DATA = gql`
  query GetPortfolioData {
    profile {
      name
      headline
      description
      location
      email
      links { kind label url order }
      skills { name category level order }
      experience { 
        company 
        position 
        description 
        startDate 
        endDate 
        achievements { text order } 
      }
      projects { 
        id 
        name 
        description 
        repoUrl 
        liveUrl 
        stack 
        order 
        images { url order } 
      }
    }
    
    reviews {
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
