import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { useCallback, useEffect, useRef } from "react";
import type {
  AnswerOption,
  Category,
  CategoryID,
  Question,
} from "../types/Form";
import { getOptionDisplay } from "../types/Form";
import IconButton from "./IconButton";
import SelectionButton from "./SelectionButton";

/**
 * A textarea that automatically adjusts its height to fit content.
 * Starts at 1 row and grows as text wraps.
 */
function AutoGrowTextarea({
  value,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: value is needed to trigger re-measurement when content changes externally
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Re-measure when the element's width changes (e.g. window resize,
  // container layout shift) so long questions don't stay truncated.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => adjustHeight());
    observer.observe(el);
    return () => observer.disconnect();
  }, [adjustHeight]);

  return (
    <textarea
      ref={ref}
      className={className}
      value={value}
      onInput={adjustHeight}
      {...props}
    />
  );
}

function QuestionLine({
  question,
  onChange,
  answerMode,
  structureEditable,
  showPrintResponseSpace,
  answerOptions,
  secondaryOptions,
  secondaryInputEnabled,
}: {
  question: Question;
  categoryID: CategoryID;
  onChange: (mapper: (category: Category) => Category) => void;
  answerMode: "hidden" | "editable" | "readonly";
  structureEditable: boolean;
  showPrintResponseSpace: boolean;
  answerOptions?: AnswerOption[];
  secondaryOptions?: AnswerOption[];
  secondaryInputEnabled?: boolean;
}) {
  const showSecondary =
    answerMode !== "hidden" &&
    !!secondaryInputEnabled &&
    !!secondaryOptions &&
    secondaryOptions.length > 0;
  const secondaryUnset = secondaryOptions
    ? secondaryOptions[secondaryOptions.length - 1].key
    : undefined;
  const secondarySelection =
    question.secondarySelection ?? secondaryUnset ?? "unset";

  return (
    <li
      key={question.id.toString()}
      className="question-line flex flex-row items-center gap-1 px-2 py-1 hover:backdrop-brightness-90"
    >
      {/* Auto-growing textarea for screen (supports text wrapping) */}
      <AutoGrowTextarea
        className="paper-field question-text screen-only mr-2 min-w-10 grow resize-none overflow-hidden p-0 leading-snug"
        value={question.value}
        placeholder="Question"
        onChange={(e) => {
          if (!structureEditable) return;
          onChange((cat) =>
            cat.withQuestion(question.id, (q) => q.withValue(e.target.value)),
          );
        }}
        disabled={!structureEditable}
        readOnly={!structureEditable}
        aria-label="Question text"
        name="question-text"
        rows={1}
      />

      {/* Print-only text that can wrap */}
      <span className="print-only question-text" aria-hidden="true">
        {question.value}
      </span>

      {/* Handwritten response space (print only) */}
      {showPrintResponseSpace && (
        <div
          className="print-only print-response-space"
          aria-hidden="true"
        ></div>
      )}

      {/* Answer slot: fixed width so buttons line up across rows even when
          some rows render no button (answerMode === "hidden").
          Width adapts to display mode: narrower for icons, wider for text labels. */}
      {answerMode !== "hidden" && (
        <div
          className={`flex shrink-0 items-center justify-center print:hidden ${
            answerOptions &&
            answerOptions.length > 0 &&
            getOptionDisplay(answerOptions[0]) === "icon"
              ? "w-10"
              : "w-20"
          }`}
        >
          <SelectionButton
            selection={question.selection}
            onClick={() => {
              if (answerMode !== "editable") return;
              onChange((cat) =>
                cat.withQuestion(question.id, (q) =>
                  q.withNextSelection(answerOptions),
                ),
              );
            }}
            className="h-6 w-6 min-w-4 shrink-0 transition-transform group-hover:scale-75"
            disabled={answerMode !== "editable"}
            answerOptions={answerOptions}
          />
        </div>
      )}

      {/* Secondary answer slot, only rendered when the template defines a
          secondary schema AND the form has opted in to the secondary row. */}
      {showSecondary && (
        <div
          className={`flex shrink-0 items-center justify-center print:hidden ${
            secondaryOptions &&
            secondaryOptions.length > 0 &&
            getOptionDisplay(secondaryOptions[0]) === "icon"
              ? "w-10"
              : "w-20"
          }`}
        >
          <SelectionButton
            selection={secondarySelection}
            onClick={() => {
              if (answerMode !== "editable") return;
              onChange((cat) =>
                cat.withQuestion(question.id, (q) =>
                  q.withNextSecondarySelection(secondaryOptions),
                ),
              );
            }}
            className="h-6 w-6 min-w-4 shrink-0 transition-transform group-hover:scale-75"
            disabled={answerMode !== "editable"}
            answerOptions={secondaryOptions}
          />
        </div>
      )}

      <div
        className="flex flex-row print:hidden"
        hidden={!structureEditable}
        role="toolbar"
        aria-label="Question actions"
      >
        <IconButton
          onClick={() => {
            if (!structureEditable) return;
            onChange((cat) => cat.withMovedQuestion(question.id, "up"));
          }}
          disabled={!structureEditable}
          aria-label="Move question up"
          title="Move question up"
        >
          <ArrowUpIcon
            className="h-4 w-4 transition-transform group-hover:scale-90 group-hover:text-th-ink-muted"
            aria-hidden="true"
          />
        </IconButton>
        <IconButton
          onClick={() => {
            if (!structureEditable) return;
            onChange((cat) => cat.withMovedQuestion(question.id, "down"));
          }}
          disabled={!structureEditable}
          aria-label="Move question down"
          title="Move question down"
        >
          <ArrowDownIcon
            className="h-4 w-4 transition-transform group-hover:scale-90 group-hover:text-th-ink-muted"
            aria-hidden="true"
          />
        </IconButton>
        <IconButton
          onClick={() => {
            if (!structureEditable) return;
            onChange((cat) => cat.removeQuestion(question.id));
          }}
          disabled={!structureEditable}
          aria-label={`Delete question: ${question.value || "untitled question"}`}
          title="Delete question"
        >
          <TrashIcon
            className="h-4 w-4 transition-transform group-hover:scale-75 group-hover:text-th-danger"
            aria-hidden="true"
          />
        </IconButton>
      </div>
    </li>
  );
}

export default QuestionLine;
