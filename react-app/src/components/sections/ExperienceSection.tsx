import React from "react";
import { fmtDate } from "../../utils/helpers";
import SectionHeader from "../ui/SectionHeader";
interface ExperienceItem {
  company: string;
  position: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  achievements?: Array<{
    text: string;
    order: number;
  }>;
}
interface ExperienceSectionProps {
  t: any;
  experience: ExperienceItem[];
}
export default function ExperienceSection({
  t,
  experience,
}: ExperienceSectionProps) {
  return (
    <section className="b-section" data-section="experience">
      <SectionHeader fileName="experience.log" title={t.headings.experience} />
      <div className="b-log">
        {experience.map((e) => (
          <div className="b-job" key={e.company + e.startDate}>
            <div className="b-job-when">
              {fmtDate(e.startDate, t)} — {fmtDate(e.endDate, t)}
            </div>
            <div className="b-job-title">
              {e.position} <span>· {e.company}</span>
            </div>
            {e.description && <div className="b-job-text">{e.description}</div>}
            {e.achievements && e.achievements.length > 0 && (
              <ul className="b-ach">
                {[...e.achievements]
                  .sort((a, b) => a.order - b.order)
                  .map((a) => (
                    <li key={a.text}>{a.text}</li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
