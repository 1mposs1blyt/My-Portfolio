import React, { useMemo } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import PortfolioWorkspace from "./components/PortfolioWorkspace";
import ReviewFormPage from "./components/ReviewFormPage"; // 💡 Импортируем форму
import "./index.css";

// Инициализируем простой и понятный клиент URQL
const client = new Client({
  url: "http://192.168.1.62:3333/graphql",
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    headers: {
      "apollo-require-preflight": "true",
    },
  },
});

export default function App() {
  const reviewToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("review"); // Вернет UUID токена или null
  }, []);
  return (
    <Provider value={client}>
      {reviewToken ? (
        <ReviewFormPage token={reviewToken} />
      ) : (
        <div className="app-container">
          <PortfolioWorkspace />
        </div>
      )}
    </Provider>
  );
}
