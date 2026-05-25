"use client";

import { useState } from "react";

interface DocumentPhaseBadgeProps {
  label: string;
  description: string;
  tone?: "draft" | "finalized" | "published" | "shared";
  meta?: string;
}

const toneClasses = {
  draft: "border-th-block text-th-ink-muted",
  finalized: "border-th-primary text-th-primary",
  published: "border-th-success text-th-success",
  shared: "border-th-info text-th-info",
} as const;

export default function DocumentPhaseBadge({
  label,
  description,
  tone = "draft",
  meta,
}: DocumentPhaseBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed top-14 right-2 z-20 print:hidden lg:right-6 xl:right-10`}
    >
      <div className="relative">
        <button
          type="button"
          className={`border bg-th-paper px-2 py-0.5 text-xs font-semibold uppercase tracking-widest ${toneClasses[tone]}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={`${label}. ${description}${meta ? ` ${meta}` : ""}`}
          aria-expanded={isOpen}
        >
          {label}
        </button>

        {isOpen && (
          <div
            role="tooltip"
            className="absolute right-0 top-full mt-1 w-52 border border-th-line bg-th-paper px-3 py-2 shadow-md"
          >
            <p className="text-xs text-th-ink">{description}</p>
            {meta && <p className="mt-1 text-xs text-th-ink-muted">{meta}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
