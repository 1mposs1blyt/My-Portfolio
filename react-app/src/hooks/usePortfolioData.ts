// src/hooks/usePortfolioData.ts
import { GET_PORTFOLIO_DATA } from "../api/queries";
import { useQuery } from "urql";


export function usePortfolioData() {
  const [{ fetching, data, error }] = useQuery({
    query: GET_PORTFOLIO_DATA,
  });

  return {
    loading: fetching,
    error: error ? error.message : null,
    profile: data?.profile || null,
  };
}
