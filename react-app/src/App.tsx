import React from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import PortfolioWorkspace from "./components/PortfolioWorkspace";
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
  return (
    /* 💡 Оборачиваем в Provider от urql и передаем созданный клиент */
    <Provider value={client}>
      <div className="app-container">
        <PortfolioWorkspace />
      </div>
    </Provider>
  );
}
