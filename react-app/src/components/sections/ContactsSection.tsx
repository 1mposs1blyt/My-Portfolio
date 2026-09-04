import React from "react";

interface LinkItem {
  kind: string;
  label: string;
  url: string;
}

// 💡 Изменили lang: LangType на t: any
interface ContactsSectionProps {
  t: any; 
  links: LinkItem[];
}

export default function ContactsSection({ t, links }: ContactsSectionProps) {
  return (
    <section className="b-section" data-section="contacts">
      <h2 className="b-h2">contacts.ts — <b>{t.headings.contacts}</b></h2>
      <div className="b-contacts">
        {links.map((l) => (
          <a className="b-contact" key={l.kind + l.url} href={l.url} target="_blank" rel="noreferrer">
            <div className="b-contact-label">{t.kinds[l.kind] || l.kind}</div>
            <div className="b-contact-hint">{l.label}</div>
          </a>
        ))}
      </div>
      <div className="b-foot">{t.footer}</div>
    </section>
  );
}
