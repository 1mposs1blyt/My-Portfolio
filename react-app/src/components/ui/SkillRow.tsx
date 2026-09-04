// src/components/ui/SkillRow.tsx
import React from "react";

interface SkillRowProps {
  name: string;
  level: number;
}

export default function SkillRow({ name, level }: SkillRowProps) {
  return (
    <li className="b-skill">
      <span>{name}</span>
      <span className="b-level" aria-label={`${level}/5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} data-on={String(n <= level)} />
        ))}
      </span>
    </li>
  );
}
