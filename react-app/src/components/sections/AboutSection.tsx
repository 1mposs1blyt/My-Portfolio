import React from "react";
import SectionHeader from "../ui/SectionHeader";

type AboutSectionProps = {
  t: any;
  profile: {
    description?: string | null;
    location?: string | null;
    email?: string | null;
  } | null;
};

export default function AboutSection({ t, profile }: AboutSectionProps) {
  return (
    <section className="b-section" data-section="about">
      <SectionHeader fileName="about.md" title={t.headings.about} />
      <div className="b-prose">
        <p>{profile?.description}</p>
        <p className="b-meta">
          {[profile?.location, profile?.email].filter(Boolean).join(" · ")}
        </p>
      </div>
    </section>
  );
}