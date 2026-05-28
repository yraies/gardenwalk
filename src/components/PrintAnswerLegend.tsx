import {
  type AnswerOption,
  getEffectiveAnswerOptions,
  getUnsetKey,
} from "../types/Form";

interface PrintAnswerLegendProps {
  answerOptions?: AnswerOption[];
  secondaryOptions?: AnswerOption[];
}

export default function PrintAnswerLegend({
  answerOptions,
  secondaryOptions,
}: PrintAnswerLegendProps) {
  const getPrintableOptions = (options: AnswerOption[] | undefined) => {
    const effectiveOptions = getEffectiveAnswerOptions(options);
    const unsetKey = getUnsetKey(options);
    return effectiveOptions.filter(
      (option) => option.key !== unsetKey && option.label.trim().length > 0,
    );
  };

  const printableOptions = getPrintableOptions(answerOptions);
  const printableSecondaryOptions = secondaryOptions
    ? getPrintableOptions(secondaryOptions)
    : [];

  if (printableOptions.length === 0 && printableSecondaryOptions.length === 0) {
    return null;
  }

  const renderOptions = (label: string, options: AnswerOption[]) => {
    if (options.length === 0) return null;
    return (
      <div className="flex items-center justify-center gap-2 text-sm leading-tight">
        <span className="font-semibold uppercase tracking-wide">{label}:</span>
        {options.map((option) => (
          <span
            key={option.key}
            className="border border-[#666] px-2 py-0.5 font-semibold"
          >
            {(option.shortLabel || option.label).trim()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="print-only document-sheet mb-1 space-y-1 bg-white px-3 py-1.5 text-center text-black">
      {renderOptions("Legend", printableOptions)}
      {renderOptions("Secondary", printableSecondaryOptions)}
    </div>
  );
}
