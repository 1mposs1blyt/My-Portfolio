import React from "react";
import SectionHeader from "../ui/SectionHeader";
import SkillRow from "../ui/SkillRow";
interface SkillGroup {
  category: string;
  items: Array<{
    name: string;
    level: number;
  }>;
}
interface SkillsSectionProps {
  t: any;
  skills: SkillGroup[];
}
export default function SkillsSection({
  t,
  skills
}: SkillsSectionProps) {
  return <section className="b-section" data-section="skills">
      <SectionHeader fileName="skills.json" title={t.headings.skills} />
      <div className="b-stackgrid">
        {skills.map(g => <div className="b-stackbox" key={g.category}>
            <h3>{t.categories[g.category] || g.category}</h3>
            <ul>
              {g.items.map(s => <SkillRow key={s.name} name={s.name} level={s.level} />)}
            </ul>
          </div>)}
      </div>
    </section>;
}