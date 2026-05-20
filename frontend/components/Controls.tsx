"use client";

import { useT, LANGS } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function Controls() {
  const { lang, setLang } = useT();
  const { theme, toggle } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <div className="flex overflow-hidden rounded-lg border border-line">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`px-2 py-1 text-xs ${
              lang === l.code ? "bg-accent text-white" : "text-muted hover:bg-fg/5"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <button
        onClick={toggle}
        title="Toggle theme"
        className="rounded-lg border border-line px-2 py-1 text-sm hover:bg-fg/5"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
