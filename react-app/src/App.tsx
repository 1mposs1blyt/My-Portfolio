import React, { lazy, Suspense, useMemo } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import PortfolioWorkspace from "./components/PortfolioWorkspace";
import ReviewFormPage from "./components/ReviewFormPage";
import { getAdminToken } from "./admin/hooks/useAdminToken";
import "./index.css";
const AdminApp = lazy(() => import("./admin/AdminApp"));
const client = new Client({
  url: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = getAdminToken();
    return {
      headers: {
        "apollo-require-preflight": "true",
        ...(token && {
          Authorization: `Bearer ${token}`
        })
      }
    };
  }
});
export default function App() {
  const isAdmin = useMemo(() => typeof window !== "undefined" && window.location.pathname.startsWith("/admin"), []);
  const isReview = useMemo(() => typeof window !== "undefined" && (window.location.pathname.startsWith("/review") || new URLSearchParams(window.location.search).has("review")), []);
  const reviewToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("review");
  }, []);
  return <Provider value={client}>
      {isAdmin ? <Suspense fallback={<div style={{
      padding: 24
    }}>
              Загрузка…
            </div>}>
          <AdminApp />
        </Suspense> : isReview ? <ReviewFormPage token={reviewToken} /> : <div className="app-container">
          <PortfolioWorkspace />
        </div>}
    </Provider>;
}