import React from "react";
import { profile } from "../../data/profile";
import SectionHeader from "../ui/SectionHeader";

export default function AboutSection({ t }: { t: any }) {
  return (
    <section className="b-section" data-section="about">
      <SectionHeader fileName="about.md" title={t.headings.about} />
      <div className="b-prose">
        <p>{profile.description}</p>
        <p className="b-meta">
          {profile.location} · {profile.email}
        </p>
      </div>
    </section>
  );
}
