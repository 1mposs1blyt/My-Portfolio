import React, { useState } from "react";
import { useQuery, useMutation } from "urql";
import { VALIDATE_TOKEN_QUERY, SUBMIT_REVIEW_MUTATION } from "../api/mutations";
const screen: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#0a0810",
  color: "#fff",
  fontFamily: "monospace",
  padding: "1rem"
};
export default function ReviewFormPage({
  token
}: {
  token: string | null;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [entered, setEntered] = useState("");
  const [activeToken, setActiveToken] = useState<string | null>(token);
  const [authorName, setAuthorName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);
  const [{ fetching, data, error }] = useQuery({
    query: VALIDATE_TOKEN_QUERY,
    variables: { token: activeToken },
    pause: !activeToken,
    requestPolicy: "network-only",
  });
  const [, executeMutation] = useMutation(SUBMIT_REVIEW_MUTATION);
  const field: React.CSSProperties = {
    width: "100%",
    background: "#0a0810",
    border: "1px solid #2a2140",
    padding: "0.6rem",
    color: "#fff",
    borderRadius: "4px",
    outline: "none",
    boxShadow: "none"
  };
  if (!activeToken) {
    return <div style={screen}>
      <div className="b-window" style={{
        width: "420px",
        background: "#14101f",
        border: "1px solid #2a2140"
      }}>
        <div className="b-window-bar" style={{
          padding: "0.5rem 1rem",
          background: "#1a1428",
          borderBottom: "1px solid #2a2140"
        }}>
          <span className="b-window-file">enter_key.sh</span>
        </div>

        <div style={{
          padding: "1.5rem"
        }}>
          <p style={{
            marginTop: 0,
            fontSize: "0.9rem",
            lineHeight: 1.5,
            opacity: 0.9
          }}>
            Чтобы оставить отзыв, нужен одноразовый ключ. Его выдаёт владелец
            портфолио — вставьте ключ из полученной ссылки.
          </p>

          <label className="b-form-label" htmlFor="review-key">
            Ключ
          </label>
          <input onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#2a2140"} id="review-key" value={entered} onChange={e => setEntered(e.target.value)} onKeyDown={e => e.key === "Enter" && entered.trim() && setActiveToken(entered.trim())} placeholder="00000000-0000-0000-0000-000000000000" className="b-form-field" autoComplete="off" />

          <button className="b-btn b-btn-main" style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.6rem"
          }} disabled={!entered.trim()} onClick={() => setActiveToken(entered.trim())}>
            Продолжить
          </button>

          <button className="b-btn" style={{
            marginTop: "0.5rem",
            width: "100%",
            padding: "0.6rem"
          }} onClick={() => window.location.href = "/"}>
            На главную
          </button>
        </div>
      </div>
    </div>;
  }
  if (fetching) return <div style={{
    ...screen,
    color: "#8B5CF6"
  }}>
    ❯ Проверка секретного ключа...
  </div>;
  const tokenData = data?.validateReviewToken;
  if (error || !tokenData?.isValid) {
    return <div style={{
      ...screen,
      color: "#FF3DA6"
    }}>
      <div className="b-window" style={{
        width: "400px",
        padding: "1.5rem",
        border: "1px solid #FF3DA6",
        background: "#14101f"
      }}>
        <h3 style={{
          margin: 0
        }}>
          [КРИТИЧЕСКАЯ ОШИБКА]
        </h3>
        <p style={{
          color: "#fff",
          marginTop: "1rem",
          fontSize: "0.9rem",
          lineHeight: 1.4
        }}>
          Секретный ключ недействителен, просрочен или уже был использован
          ранее.
        </p>
        <button className="b-btn" style={{
          marginTop: "1rem",
          width: "100%"
        }} onClick={() => {
          setActiveToken(null);
          setEntered("");
        }}>
          Ввести другой ключ
        </button>
        <button className="b-btn" style={{
          marginTop: "0.5rem",
          width: "100%"
        }} onClick={() => window.location.href = "/"}>
          Вернуться
        </button>
      </div>
    </div>;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !text) return;
    const result = await executeMutation({
      input: {
        token: activeToken,
        authorName,
        company: company || undefined,
        position: position || undefined,
        text,
        rating: Number(rating)
      }
    });
    if (!result.error) {
      setSuccess(true);
    } else {
      setSubmitError(result.error.message.replace("[GraphQL] ", ""));
    }
  };
  if (success) {
    return <div style={screen}>
      <div className="b-window" style={{
        width: "450px",
        padding: "2rem",
        textAlign: "center",
        background: "#14101f",
        border: "1px solid #2a2140"
      }}>
        <h3 style={{
          color: "#FF3DA6",
          margin: 0
        }}>
          ❯ отзыв_успешно_сохранен.sh
        </h3>
        <p style={{
          marginTop: "1rem",
          opacity: 0.9,
          fontSize: "0.9rem",
          lineHeight: 1.4
        }}>
          Большое спасибо! Ваш отзыв сохранён, а одноразовый ключ аннулирован.
        </p>
        <button className="b-btn b-btn-main" style={{
          marginTop: "1.5rem",
          width: "100%"
        }} onClick={() => window.location.href = "/"}>
          На главную
        </button>
      </div>
    </div>;
  }
  return <div style={screen}>
    <div className="b-window" style={{
      width: "550px",
      background: "#14101f",
      border: "1px solid #2a2140"
    }}>
      <div className="b-window-bar" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        background: "#1a1428",
        borderBottom: "1px solid #2a2140"
      }}>
        <span className="b-window-file">write_review_form.exe</span>
        <span style={{
          color: "#8B5CF6",
          fontSize: "0.8rem",
          marginLeft: "auto"
        }}>
          [
          {tokenData.type === "CLIENT" ? `Отзыв к проекту: ${tokenData.projectName || "Без названия"}` : "Рекомендация работодателя"}
          ]
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div>
          <label className="b-form-label" htmlFor="rv-name">
            Ваше имя и фамилия *
          </label>
          <input onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#2a2140"} id="rv-name" type="text" required value={authorName} onChange={e => setAuthorName(e.target.value)} className="b-form-field" />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem"
        }}>
          <div>
            <label className="b-form-label" htmlFor="rv-company">
              Компания
            </label>
            <input onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#2a2140"} id="rv-company" type="text" value={company} onChange={e => setCompany(e.target.value)} className="b-form-field" />
          </div>
          <div>
            <label className="b-form-label" htmlFor="rv-position">
              Должность
            </label>
            <input onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#2a2140"} id="rv-position" type="text" value={position} onChange={e => setPosition(e.target.value)} className="b-form-field" />
          </div>
        </div>

        <div>
          <label className="b-form-label" htmlFor="rv-text">
            Текст отзыва / рекомендации *
          </label>
          <textarea onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#2a2140"} id="rv-text" required rows={5} value={text} onChange={e => setText(e.target.value)} style={{
            ...field,
            resize: "none",
            lineHeight: 1.4
          }} />
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem"
        }}>
          <div>
            <label className="b-form-label" htmlFor="rv-rating">
              Оценка:
            </label>
            <select onFocus={e => e.target.style.borderColor = "#8b5cf6"} onBlur={e => e.target.style.borderColor = "#2a2140"} id="rv-rating" value={rating} onChange={e => setRating(Number(e.target.value))} style={{
              background: "#0a0810",
              color: "#fff",
              border: "1px solid #2a2140",
              padding: "0.4rem",
              borderRadius: "4px",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
              font: "inherit",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none"
            }}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>
                {n} ★
              </option>)}
            </select>
          </div>
          {submitError && (
            <div style={{ color: "#FF3DA6", fontSize: "0.85rem" }}>{submitError}</div>
          )}
          <button type="submit" className="b-btn b-btn-main" style={{
            padding: "0.6rem 1.5rem"
          }}>
            Отправить отзыв
          </button>
        </div>
      </form>
    </div>
  </div>;
}