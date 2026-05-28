import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  HandThumbUpIcon,
  HeartIcon,
  MinusCircleIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";
import dynamic from "next/dynamic";
import type React from "react";
import { type AnswerSemantic, useTheme } from "../contexts/ThemeContext";
import {
  type AnswerOption,
  getEffectiveAnswerOptions,
  getOptionDisplay,
  getUnsetKey,
} from "../types/Form";

/** A simple open circle for unset/unknown answer keys in icon mode. */
function EmptyCircleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      {...props}
    >
      <circle cx="10" cy="10" r="7" />
    </svg>
  );
}

/** Arrow pointing up-right at 45°. */
function ArrowUpRightIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 010-1.06l7.72-7.72H7.5a.75.75 0 010-1.5h7.25a.75.75 0 01.75.75v7.25a.75.75 0 01-1.5 0V7.06l-7.72 7.72a.75.75 0 01-1.06 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Arrow pointing down-right at 45°. */
function ArrowDownRightIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M5.22 5.22a.75.75 0 011.06 0l7.72 7.72V7.5a.75.75 0 011.5 0v7.25a.75.75 0 01-.75.75H7.5a.75.75 0 010-1.5h5.44L5.22 6.28a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** A simple rising trendline. */
function TrendUpIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="4,14 8,10 12,12 16,6" />
      <polyline points="12,6 16,6 16,10" />
    </svg>
  );
}

/** A simple falling trendline. */
function TrendDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polyline points="4,6 8,10 12,8 16,14" />
      <polyline points="12,14 16,14 16,10" />
    </svg>
  );
}

type IconComponent = React.ComponentType<React.ComponentProps<"svg">>;

/**
 * Available icons for answer options. Each entry has a stable string key,
 * a display label, and the React icon component.
 * Exported so the AnswerSchemaEditor icon picker can reuse the same set.
 */
export const AVAILABLE_ICONS: {
  key: string;
  label: string;
  Icon: IconComponent;
}[] = [
  { key: "exclamation", label: "Exclamation", Icon: ExclamationCircleIcon },
  { key: "check", label: "Check", Icon: CheckCircleIcon },
  { key: "question", label: "Question", Icon: QuestionMarkCircleIcon },
  { key: "minus", label: "Minus", Icon: MinusCircleIcon },
  { key: "x", label: "Cross", Icon: XCircleIcon },
  { key: "heart", label: "Heart", Icon: HeartIcon },
  { key: "star", label: "Star", Icon: StarIcon },
  { key: "thumbsup", label: "Thumbs Up", Icon: HandThumbUpIcon },
  { key: "arrow-up-right", label: "Arrow Up-Right", Icon: ArrowUpRightIcon },
  {
    key: "arrow-down-right",
    label: "Arrow Down-Right",
    Icon: ArrowDownRightIcon,
  },
  { key: "trend-up", label: "Trend Up", Icon: TrendUpIcon },
  { key: "trend-down", label: "Trend Down", Icon: TrendDownIcon },
  { key: "empty", label: "Empty", Icon: EmptyCircleIcon },
];

/** Icon registry keyed by icon identifier string. */
export const ICON_MAP: Record<string, IconComponent> = Object.fromEntries(
  AVAILABLE_ICONS.map((i) => [i.key, i.Icon]),
);

/**
 * Legacy lookup: maps old built-in answer keys to icon identifiers
 * for backward compatibility with data that lacks an explicit `icon` field.
 */
export const LEGACY_KEY_TO_ICON: Record<string, string> = {
  must: "exclamation",
  like: "check",
  open: "thumbsup",
  maybe: "question",
  off_limits: "minus",
  unset: "empty",
};

/**
 * Resolves the icon component for an answer option.
 * Prefers the explicit `icon` field; falls back to legacy key mapping; then EmptyCircleIcon.
 */
function getIconForOption(option: AnswerOption): IconComponent {
  if (option.icon && ICON_MAP[option.icon]) {
    return ICON_MAP[option.icon];
  }
  const legacyIcon = LEGACY_KEY_TO_ICON[option.key];
  if (legacyIcon && ICON_MAP[legacyIcon]) {
    return ICON_MAP[legacyIcon];
  }
  return EmptyCircleIcon;
}

/**
 * Resolves the display colors for an answer option given a theme chip-color
 * resolver.
 */
export function resolveOptionColors(
  option: AnswerOption,
  isUnset: boolean,
  getChipColor: (semantic: AnswerSemantic | undefined) => {
    bg: string;
    text: string;
  },
): { bgColor: string; textColor: string } {
  const chipColor = option.semantic
    ? getChipColor(option.semantic)
    : isUnset
      ? getChipColor(undefined)
      : null;
  const bgColor = chipColor ? chipColor.bg : option.color;
  const textColor = chipColor ? chipColor.text : "#ffffff";
  return { bgColor, textColor };
}

interface SelectionButtonProps {
  selection: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  answerOptions?: AnswerOption[];
}

const SelectionButtonComponent: React.FC<SelectionButtonProps> = ({
  selection,
  onClick,
  className = "",
  disabled = false,
  answerOptions,
}) => {
  const { getChipColor } = useTheme();
  const options = getEffectiveAnswerOptions(answerOptions);
  const unsetKey = getUnsetKey(answerOptions);

  const option =
    options.find((o) => o.key === selection) ?? options[options.length - 1];

  const Icon = getIconForOption(option);
  const isSelected = selection !== unsetKey;
  const displayMode = getOptionDisplay(option);

  // Resolve colors: prefer theme-derived semantic colors, fall back to raw option.color
  const isUnset = selection === unsetKey;
  const { bgColor, textColor } = resolveOptionColors(
    option,
    isUnset,
    getChipColor,
  );

  // Icon button rendering
  if (displayMode === "icon") {
    return (
      <button
        type="button"
        className={`selection-button group flex h-8 w-8 cursor-pointer items-center justify-center ${disabled ? "cursor-not-allowed" : ""}`}
        onClick={disabled ? undefined : onClick}
        title={option.label}
        disabled={disabled}
        aria-label={`Set response to ${option.label}`}
        aria-pressed={isSelected}
        data-selected={isSelected}
        data-label={option.shortLabel}
        style={
          {
            "--selection-print-bg": isSelected ? bgColor : "transparent",
            "--selection-print-text": isSelected ? textColor : "#666666",
            "--selection-print-border": isSelected ? bgColor : "#666666",
          } as React.CSSProperties
        }
      >
        <Icon
          className={`${className}`}
          style={{ color: bgColor }}
          aria-hidden="true"
        />
      </button>
    );
  }

  // Text button rendering
  return (
    <button
      type="button"
      className={`selection-button h-8 w-16 cursor-pointer font-extrabold ${className} ${disabled ? "cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
      title={option.label}
      disabled={disabled}
      aria-label={`Set response to ${option.label}`}
      aria-pressed={isSelected}
      data-selected={isSelected}
      data-label={option.shortLabel}
      style={
        {
          backgroundColor: bgColor,
          color: textColor,
          "--selection-print-bg": isSelected ? bgColor : "transparent",
          "--selection-print-text": isSelected ? textColor : "#666666",
          "--selection-print-border": isSelected ? bgColor : "#666666",
        } as React.CSSProperties
      }
    >
      {option.shortLabel}
    </button>
  );
};

// Create a client-side only version using dynamic import
const SelectionButton = dynamic(
  () => Promise.resolve(SelectionButtonComponent),
  {
    ssr: false,
    loading: () => <div className="h-10 w-10" />,
  },
);

export default SelectionButton;
