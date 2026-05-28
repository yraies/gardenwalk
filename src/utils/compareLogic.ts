import {
  type AnswerOption,
  type Form,
  formHasSecondaryAnswers,
  getUnsetKey,
} from "../types/Form";

/** A loaded form with its display label. */
export type ComparisonEntry = {
  label: string;
  form: Form;
};

/** A single question row across all compared forms. */
export type ComparisonRow = {
  questionId: string;
  questionText: string;
  /** One selection key per form, in the same order as the entries array. */
  selections: string[];
  /**
   * One secondary selection per form. Entry is undefined when the form
   * either lacks a secondary schema or has no non-unset secondary answers.
   */
  secondarySelections: (string | undefined)[];
};

/** A category section across all compared forms. */
export type ComparisonCategory = {
  categoryId: string;
  categoryName: string;
  rows: ComparisonRow[];
};

/** Full comparison result. */
export type ComparisonResult = {
  categories: ComparisonCategory[];
  /** The answer options to use for display (from the first form). */
  answerOptions: AnswerOption[] | undefined;
  /** The secondary options to use for display (from the first form that has any). */
  secondaryOptions: AnswerOption[] | undefined;
  /** For each entry, whether it should contribute a secondary column. */
  formHasSecondary: boolean[];
  /** Whether the forms are structurally compatible (share question IDs). */
  isCompatible: boolean;
  /** How many question IDs overlap across all forms. */
  overlapCount: number;
  /** Total unique question IDs across all forms. */
  totalQuestionCount: number;
};

/**
 * Builds a comparison result from 2+ forms by aligning categories and questions
 * by their TypeIDs. Forms from the same template share identical IDs.
 */
export function buildComparison(entries: ComparisonEntry[]): ComparisonResult {
  if (entries.length < 2) {
    return {
      categories: [],
      answerOptions: undefined,
      secondaryOptions: undefined,
      formHasSecondary: [],
      isCompatible: false,
      overlapCount: 0,
      totalQuestionCount: 0,
    };
  }

  // Use the first form's answer options for display
  const answerOptions = entries[0].form.answerOptions;

  // Per-form secondary visibility and a representative secondary schema
  // (taken from the first form that has any non-unset secondary answers).
  const formHasSecondary = entries.map((e) => formHasSecondaryAnswers(e.form));
  const firstWithSecondary = entries.find((e) =>
    formHasSecondaryAnswers(e.form),
  );
  const secondaryOptions = firstWithSecondary?.form.secondaryOptions;

  // Collect all unique category IDs in order (preserving first-form order,
  // then appending any extras from subsequent forms)
  const seenCategoryIds = new Set<string>();
  const orderedCategoryIds: string[] = [];
  const categoryNames = new Map<string, string>();

  for (const entry of entries) {
    for (const cat of entry.form.categories) {
      const catId = cat.id.toString();
      if (!seenCategoryIds.has(catId)) {
        seenCategoryIds.add(catId);
        orderedCategoryIds.push(catId);
        categoryNames.set(catId, cat.name);
      }
    }
  }

  // Collect all unique question IDs per category
  const categoryQuestions = new Map<
    string,
    { questionId: string; questionText: string }[]
  >();

  for (const catId of orderedCategoryIds) {
    const seenQuestionIds = new Set<string>();
    const questions: { questionId: string; questionText: string }[] = [];

    for (const entry of entries) {
      const cat = entry.form.categories.find((c) => c.id.toString() === catId);
      if (!cat) continue;
      for (const q of cat.questions) {
        const qId = q.id.toString();
        if (!seenQuestionIds.has(qId)) {
          seenQuestionIds.add(qId);
          questions.push({ questionId: qId, questionText: q.value });
        }
      }
    }

    categoryQuestions.set(catId, questions);
  }

  // Build comparison categories with rows
  const unsetKey = getUnsetKey(answerOptions);
  const categories: ComparisonCategory[] = orderedCategoryIds.map((catId) => {
    const questions = categoryQuestions.get(catId) ?? [];
    const rows: ComparisonRow[] = questions.map(
      ({ questionId, questionText }) => {
        const selections = entries.map((entry) => {
          const cat = entry.form.categories.find(
            (c) => c.id.toString() === catId,
          );
          if (!cat) return unsetKey;
          const question = cat.questions.find(
            (q) => q.id.toString() === questionId,
          );
          return question ? question.selection : unsetKey;
        });
        const secondarySelections = entries.map((entry, idx) => {
          if (!formHasSecondary[idx]) return undefined;
          const cat = entry.form.categories.find(
            (c) => c.id.toString() === catId,
          );
          if (!cat) return undefined;
          const question = cat.questions.find(
            (q) => q.id.toString() === questionId,
          );
          return question?.secondarySelection;
        });
        return { questionId, questionText, selections, secondarySelections };
      },
    );

    return {
      categoryId: catId,
      categoryName: categoryNames.get(catId) ?? "Unknown",
      rows,
    };
  });

  // Calculate overlap statistics
  const allQuestionIds = new Set<string>();
  const perFormQuestionIds: Set<string>[] = entries.map(() => new Set());

  for (let i = 0; i < entries.length; i++) {
    for (const cat of entries[i].form.categories) {
      for (const q of cat.questions) {
        const qId = q.id.toString();
        allQuestionIds.add(qId);
        perFormQuestionIds[i].add(qId);
      }
    }
  }

  // Overlap = IDs present in ALL forms
  let overlapCount = 0;
  for (const qId of allQuestionIds) {
    if (perFormQuestionIds.every((s) => s.has(qId))) {
      overlapCount++;
    }
  }

  return {
    categories,
    answerOptions,
    secondaryOptions,
    formHasSecondary,
    isCompatible: overlapCount > 0,
    overlapCount,
    totalQuestionCount: allQuestionIds.size,
  };
}
