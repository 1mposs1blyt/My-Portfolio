import { GET_PORTFOLIO_DATA } from "../api/queries";
import { useQuery } from "urql";
export function usePortfolioData(lang: "ru" | "en") {
  const [{ fetching, data, error }] = useQuery({
    query: GET_PORTFOLIO_DATA,
    variables: {
      lang: lang === "en" ? "EN" : "RU",
    },
    requestPolicy: "cache-and-network",
  });
  return {
    loading: fetching,
    error: error ? error.message : null,
    profile: data?.profile || null,
    reviews: data?.reviews || [],
  };
}
