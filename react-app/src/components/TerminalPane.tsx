import React, { useState, useEffect } from "react";
import { LangType, Localization } from "../types/portfolio";
import { useReducedMotion } from "../hooks/useReducedMotion";
type TerminalPaneProps = {
  lang: LangType;
  t: Localization;
};
export default function TerminalPane({ lang, t }: TerminalPaneProps) {
  const reduced = useReducedMotion();
  const script = t.script;
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (reduced) {
      setLine(script.length);
      setFinished(true);
      return;
    }
    setLine(0);
    setChars(0);
    setFinished(false);
  }, [lang, reduced, script.length]);
  useEffect(() => {
    if (reduced || finished) return;
    if (line >= script.length) {
      setFinished(true);
      return;
    }
    const cmd = script[line].cmd;
    if (chars < cmd.length) {
      const timer = setTimeout(
        () => setChars((c) => c + 1),
        32 + Math.random() * 45,
      );
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setLine((l) => l + 1);
      setChars(0);
    }, 430);
    return () => clearTimeout(timer);
  }, [line, chars, finished, reduced, script]);
  return (
    <div className="b-window b-terminal">
      <div className="b-window-bar">
        <span className="b-dotbtn" />
        <span className="b-dotbtn" />
        <span className="b-dotbtn" />
        <span className="b-window-title">zsh — portfolio</span>
      </div>
      <div className="b-window-body" aria-live="polite">
        {script.map((step, i) => {
          if (i > line) return null;
          const typing = i === line && !finished;
          return (
            <div key={i}>
              <div className="b-cmdline">
                <span className="b-sign">❯ </span>
                <span>{typing ? step.cmd.slice(0, chars) : step.cmd}</span>
                {typing && <span className="b-caret" />}
              </div>
              {!typing &&
                step.out.map((o, k) => (
                  <div className="b-outline" key={k}>
                    {o}
                  </div>
                ))}
            </div>
          );
        })}
        {finished && (
          <div className="b-cmdline">
            <span className="b-sign">❯ </span>
            <span className="b-caret" />
          </div>
        )}
      </div>
    </div>
  );
}
