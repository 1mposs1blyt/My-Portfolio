// src/admin/AdminApp.tsx
import React, { useState } from "react";
import AdminShell from "./AdminShell";
import ProfilePage from "./pages/ProfilePage";
import SkillsPage from "./pages/SkillsPage";
import ContactsPage from "./pages/ContactsPage";
import ExperiencePage from "./pages/ExperiencePage";
import ProjectsPage from "./pages/ProjectsPage";
import "./admin.css";
import ReviewsPage from "./pages/ReviewsPage";
import { ConfirmProvider } from "./ui/ConfirmProvider";

export default function AdminApp() {
  const [active, setActive] = useState("profile");

  return (
    <ConfirmProvider>
      <AdminShell active={active} onNavigate={setActive}>
        {active === "profile" && <ProfilePage />}
        {active === "skills" && <SkillsPage />}
        {active === "links" && <ContactsPage />}
        {active === "experience" && <ExperiencePage />}
        {active === "projects" && <ProjectsPage />}
        {active === "reviews" && <ReviewsPage />}
      </AdminShell>
    </ConfirmProvider>
  );
}
