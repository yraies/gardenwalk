"use client";

import { useTheme } from "../contexts/ThemeContext";
import {
  type AnswerOption,
  getEffectiveAnswerOptions,
  getOptionDisplay,
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
  /**
   * When provided, render an additional "Secondary" section below the
   * primary options. Pass undefined to hide the secondary section entirely
   * (e.g. when the form has no secondary schema or has it disabled).
   */
  secondaryOptions?: AnswerOption[];
}

export default function ResponseOptionsLegend({
  answerOptions,
  secondaryOptions,
}: ResponseOptionsLegendProps) {
  const { getChipColor } = useTheme();
  const options = getEffectiveAnswerOptions(answerOptions).filter(
    (option) => option.label.trim().length > 0,
  );
  const unsetKey = getUnsetKey(answerOptions);

  const secondaryList =
    secondaryOptions && secondaryOptions.length > 0
      ? secondaryOptions.filter((o) => o.label.trim().length > 0)
      : [];
  const secondaryUnsetKey =
    secondaryOptions && secondaryOptions.length > 0
      ? secondaryOptions[secondaryOptions.length - 1].key
      : undefined;

  if (options.length === 0 && secondaryList.length === 0) return null;

  const renderRow = (
    list: AnswerOption[],
    listUnsetKey: string | undefined,
  ) => (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
      {list.map((option) => {
        const chipColor = option.semantic
          ? getChipColor(option.semantic)
          : option.key === listUnsetKey
            ? getChipColor(undefined)
            : null;
        const bgColor = chipColor ? chipColor.bg : option.color;
        const textColor = chipColor ? chipColor.text : "#ffffff";
        const iconKey =
          option.icon ?? LEGACY_KEY_TO_ICON[option.key] ?? "empty";
        const Icon = ICON_MAP[iconKey] ?? ICON_MAP.empty;
        const showIcon = getOptionDisplay(option) === "icon";

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
  );

  return (
    <aside className="document-sheet mb-2 border border-th-line bg-th-paper px-3 py-2 print:hidden">
      {options.length > 0 && (
        <>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-th-ink-muted">
            Response options
          </p>
          {renderRow(options, unsetKey)}
        </>
      )}
      {secondaryList.length > 0 && (
        <>
          <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-widest text-th-ink-muted">
            Secondary
          </p>
          {renderRow(secondaryList, secondaryUnsetKey)}
        </>
      )}
    </aside>
  );
}
