// src/components/ReviewFormPage.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "urql";
import { VALIDATE_TOKEN_QUERY, SUBMIT_REVIEW_MUTATION } from "../api/mutations";

export default function ReviewFormPage({ token }: { token: string }) {
  const [authorName, setAuthorName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  // Проверяем токен у NestJS
  const [{ fetching, data, error }] = useQuery({
    query: VALIDATE_TOKEN_QUERY,
    variables: { token },
  });

  // Готовим мутацию отправки
  const [, executeMutation] = useMutation(SUBMIT_REVIEW_MUTATION);

  if (fetching) return <div className="b-loading-screen" style={{ color: "#8B5CF6", padding: "2rem", fontFamily: "monospace" }}>❯ Проверка секретного ключа...</div>;
  
  const tokenData = data?.validateReviewToken;
  if (error || !tokenData?.isValid) {
    return (
      <div className="b-root b-error-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0a0810", color: "#FF3DA6", fontFamily: "monospace" }}>
        <div className="b-window" style={{ width: "400px", padding: "1.5rem", border: "1px solid #FF3DA6", background: "#14101f" }}>
          <h3 style={{ margin: 0 }}>[КРИТИЧЕСКАЯ ОШИБКА]</h3>
          <p style={{ color: "#fff", marginTop: "1rem", fontSize: "0.9rem", lineHeight: 1.4 }}>
            Секретный ключ недействителен, просрочен или уже был использован ранее.
          </p>
          <button className="b-btn" style={{ marginTop: "1rem", width: "100%" }} onClick={() => window.location.href = "/"}>Вернуться</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !text) return;

    const result = await executeMutation({
      input: {
        token,
        authorName,
        company: company || undefined,
        position: position || undefined,
        text,
        rating: Number(rating),
      },
    });

    if (!result.error) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="b-root" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0a0810", color: "#fff", fontFamily: "monospace" }}>
        <div className="b-window" style={{ width: "450px", padding: "2rem", textAlign: "center", background: "#14101f", border: "1px solid #2a2140" }}>
          <h3 style={{ color: "#FF3DA6", margin: 0 }}>❯ отзыв_успешно_сохранен.sh</h3>
          <p style={{ marginTop: "1rem", opacity: 0.9, fontSize: "0.9rem", lineHeight: 1.4 }}>
            Большое спасибо! Ваш отзыв сохранен в базе данных PostgreSQL, а одноразовый ключ аннулирован.
          </p>
          <button className="b-btn b-btn-main" style={{ marginTop: "1.5rem", width: "100%" }} onClick={() => window.location.href = "/"}>На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="b-root" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0a0810", padding: "1rem", color: "#fff", fontFamily: "monospace" }}>
      <div className="b-window" style={{ width: "550px", background: "#14101f", border: "1px solid #2a2140" }}>
        <div className="b-window-bar" style={{ display: "flex", justifyContent: "between", alignItems: "center", padding: "0.5rem 1rem", background: "#1a1428", borderBottom: "1px solid #2a2140" }}>
          <span className="b-window-file">write_review_form.exe</span>
          <span style={{ color: "#8B5CF6", fontSize: "0.8rem", marginLeft: "auto" }}>
            [{tokenData.type === "CLIENT" ? `Отзыв к проекту: ${tokenData.projectName || 'Без названия'}` : "Рекомендация работодателя"}]
          </span>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#8B5CF6" }}>Ваше Имя и Фамилия *</label>
            <input type="text" required value={authorName} onChange={(e) => setAuthorName(e.target.value)} style={{ width: "100%", background: "#0a0810", border: "1px solid #2a2140", padding: "0.6rem", color: "#fff", borderRadius: "4px" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#8B5CF6" }}>Компания</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} style={{ width: "100%", background: "#0a0810", border: "1px solid #2a2140", padding: "0.6rem", color: "#fff", borderRadius: "4px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#8B5CF6" }}>Должность</label>
              <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} style={{ width: "100%", background: "#0a0810", border: "1px solid #2a2140", padding: "0.6rem", color: "#fff", borderRadius: "4px" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#8B5CF6" }}>Текст отзыва / рекомендации *</label>
            <textarea required rows={5} value={text} onChange={(e) => setText(e.target.value)} style={{ width: "100%", background: "#0a0810", border: "1px solid #2a2140", padding: "0.6rem", color: "#fff", borderRadius: "4px", resize: "none", lineHeight: 1.4 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            <div>
              <label style={{ marginRight: "0.75rem", fontSize: "0.9rem", color: "#8B5CF6" }}>Оценка:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ background: "#0a0810", color: "#fff", border: "1px solid #2a2140", padding: "0.4rem", borderRadius: "4px", cursor: "pointer" }}>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <button type="submit" className="b-btn b-btn-main" style={{ padding: "0.6rem 1.5rem" }}>Отправить отзыв</button>
          </div>
        </form>
      </div>
    </div>
  );
}
