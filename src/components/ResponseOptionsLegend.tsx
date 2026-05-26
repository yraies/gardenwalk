"use client";

import { useDisplayPreferences } from "../contexts/DisplayPreferencesContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  type AnswerOption,
  getEffectiveAnswerOptions,
  getUnsetKey,
} from "../types/Form";
import { AVAILABLE_ICONS } from "./SelectionButton";

const ICON_MAP = Object.fromEntries(
  AVAILABLE_ICONS.map(({ key, Icon }) => [key, Icon]),
);

const LEGACY_KEY_TO_ICON: Record<string, string> = {
  must: "exclamation",
  like: "check",
  open: "thumbsup",
  maybe: "question",
  off_limits: "minus",
  unset: "empty",
};

interface ResponseOptionsLegendProps {
  answerOptions?: AnswerOption[];
}

export default function ResponseOptionsLegend({
  answerOptions,
}: ResponseOptionsLegendProps) {
  const { showIcon } = useDisplayPreferences();
  const { getChipColor } = useTheme();
  const options = getEffectiveAnswerOptions(answerOptions).filter(
    (option) => option.label.trim().length > 0,
  );
  const unsetKey = getUnsetKey(answerOptions);

  if (options.length === 0) return null;

  return (
    <aside className="document-sheet mb-2 border border-th-line bg-th-paper px-3 py-2 print:hidden">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-th-ink-muted">
        Response options
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
        {options.map((option) => {
          const chipColor = option.semantic
            ? getChipColor(option.semantic)
            : option.key === unsetKey
              ? getChipColor(undefined)
              : null;
          const bgColor = chipColor ? chipColor.bg : option.color;
          const textColor = chipColor ? chipColor.text : "#ffffff";
          const iconKey =
            option.icon ?? LEGACY_KEY_TO_ICON[option.key] ?? "empty";
          const Icon = ICON_MAP[iconKey] ?? ICON_MAP.empty;

          return (
            <li key={option.key} className="flex items-center gap-1.5 text-xs">
              {showIcon ? (
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: bgColor }}
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="inline-flex min-w-8 items-center justify-center border border-th-line px-1 py-0.5 text-[0.65rem] font-extrabold leading-none"
                  style={{ backgroundColor: bgColor, color: textColor }}
                  aria-hidden="true"
                >
                  {option.shortLabel || option.label}
                </span>
              )}
              <span className="text-th-ink-muted">{option.label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
