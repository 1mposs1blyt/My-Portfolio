import React from "react";
interface SectionHeaderProps {
  fileName: string;
  title: string;
}
export default function SectionHeader({
  fileName,
  title
}: SectionHeaderProps) {
  return <h2 className="b-h2">
      {fileName} — <b>{title}</b>
    </h2>;
}