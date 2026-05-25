"use client";

import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

interface DocumentPhaseNoticeProps {
  label: string;
  description: string;
  tone?: "draft" | "finalized" | "published" | "shared";
  meta?: string;
  defaultExpanded?: boolean;
}

const toneClasses = {
  draft: "border-th-block text-th-ink-muted",
  finalized: "border-th-primary text-th-ink",
  published: "border-th-success text-th-success",
  shared: "border-th-info text-th-info",
} as const;

export default function DocumentPhaseNotice({
  label,
  description,
  tone = "draft",
  meta,
  defaultExpanded = false,
}: DocumentPhaseNoticeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`mb-3 w-full max-w-full border-l-4 bg-th-paper print:hidden ${toneClasses[tone]}`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="flex w-full items-center gap-1.5 px-3 py-2 text-left"
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 opacity-60" />
        ) : (
          <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 opacity-60" />
        )}
        <span className="text-sm font-semibold uppercase tracking-widest">
          {label}
        </span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-2">
          <p className="text-sm text-th-ink">{description}</p>
          {meta && <p className="mt-1 text-xs text-th-ink-muted">{meta}</p>}
        </div>
      )}
    </div>
  );
}
