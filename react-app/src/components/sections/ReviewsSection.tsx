// src/components/sections/ReviewsSection.tsx
import React from "react";
import SectionHeader from "../ui/SectionHeader";

interface ReviewsSectionProps {
  t: any;
  reviews: any[];
}

export default function ReviewsSection({ t, reviews }: ReviewsSectionProps) {
  // Если рекомендаций работодателей в базе пока нет, секция просто скрывается и не портит верстку
  if (reviews.length === 0) return null;

  return (
    <section className="b-section" data-section="reviews">
      <SectionHeader
        fileName="reviews.log"
        title={t.headings?.recommendations || "Рекомендации"}
      />
      <div
        className="b-reviews-grid"
        style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}
      >
        {reviews.map((rev) => (
          <div key={rev.id} className="b-window b-review-card">
            <div className="b-window-bar">
              {/* Превращаем имя автора в название txt файла для стиля */}
              <span className="b-window-file">
                {/* 🚀 СТАЛО: динамически подставляем префикс в зависимости от типа отзыва */}
                {rev.type === "CLIENT"
                  ? "review_from_"
                  : "recommendation_from_"}
                {rev.authorName.toLowerCase().replace(/\s+/g, "_")}.txt
              </span>
            </div>
            <div className="b-card-body" style={{ padding: "1.25rem" }}>
              <p
                className="b-review-text"
                style={{ fontStyle: "italic", opacity: 0.9, lineHeight: 1.5 }}
              >
                “{rev.text}”
              </p>
              <div
                className="b-review-meta"
                style={{
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                  color: "#8B5CF6",
                }}
              >
                <strong style={{ color: "#fff" }}>{rev.authorName}</strong>
                {rev.position && <span> · {rev.position}</span>}
                {rev.company && (
                  <span className="b-company"> в {rev.company}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
