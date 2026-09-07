export type UiLang = "ru" | "en";

export const getReviewFormLocalization = () => ({
  ru: {
    // экран ввода ключа
    keyFile: "enter_key.sh",
    keyIntro:
      "Чтобы оставить отзыв, нужен одноразовый ключ. Его выдаёт владелец портфолио — вставьте ключ из полученной ссылки.",
    keyLabel: "Ключ",
    keyContinue: "Продолжить",
    toHome: "На главную",

    // проверка
    checking: "❯ Проверка секретного ключа...",

    // ошибка
    errorTitle: "[КРИТИЧЕСКАЯ ОШИБКА]",
    errorText:
      "Секретный ключ недействителен, просрочен или уже был использован ранее.",
    errorRetry: "Ввести другой ключ",
    errorBack: "Вернуться",

    // форма
    formFile: "write_review_form.exe",
    forProject: (name: string) => `Отзыв к проекту: ${name}`,
    untitledProject: "Без названия",
    employerBadge: "Рекомендация работодателя",
    name: "Ваше имя и фамилия *",
    company: "Компания",
    position: "Должность",
    text: "Текст отзыва / рекомендации *",
    rating: "Оценка:",
    submit: "Отправить отзыв",

    // успех
    successFile: "❯ отзыв_успешно_сохранен.sh",
    successText:
      "Большое спасибо! Ваш отзыв сохранён, а одноразовый ключ аннулирован.",
  },

  en: {
    keyFile: "enter_key.sh",
    keyIntro:
      "You need a one-time key to leave a review. The portfolio owner issues it — paste the key from the link you received.",
    keyLabel: "Key",
    keyContinue: "Continue",
    toHome: "Back to site",

    checking: "❯ Verifying the key...",

    errorTitle: "[CRITICAL ERROR]",
    errorText:
      "This key is invalid, has expired, or has already been used.",
    errorRetry: "Try another key",
    errorBack: "Go back",

    formFile: "write_review_form.exe",
    forProject: (name: string) => `Review for project: ${name}`,
    untitledProject: "Untitled",
    employerBadge: "Employer recommendation",
    name: "Your full name *",
    company: "Company",
    position: "Job title",
    text: "Your review / recommendation *",
    rating: "Rating:",
    submit: "Submit review",

    successFile: "❯ review_saved_successfully.sh",
    successText:
      "Thank you! Your review has been saved and the one-time key is now void.",
  },
});