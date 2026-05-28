import { TypeID, typeid } from "typeid-js";

enum Selection {
  MUST_HAVE = "must",
  LIKE = "like",
  OPEN_TO_IT = "open",
  MAYBE = "maybe",
  OFF_LIMITS = "off_limits",
  UNSET = "unset",
}

/**
 * Semantic tier for answer options. Used by the seasonal theme system
 * to provide appropriate colors for each answer state.
 * - "must": strong positive / essential answers
 * - "like": moderate positive / affirmative answers
 * - "neutral": no strong opinion either way
 * - "maybe": uncertain / slight hesitation
 * - "dislike": negative / boundary answers
 * - "misc": special / attention-needed answers
 */
export type AnswerSemantic =
  | "must"
  | "like"
  | "neutral"
  | "maybe"
  | "dislike"
  | "misc";

/**
 * Visual rendering mode for an answer option's button/legend chip.
 * - "text": render the shortLabel inside a colored pill button.
 * - "icon": render the option's icon only.
 * Decided per-option by the template creator. Older data without this field
 * defaults to "text".
 */
export type AnswerDisplay = "icon" | "text";

/**
 * Defines one answer option in a template-wide answer schema.
 * The `key` is stored in `Question.selection` and must be unique within a schema.
 */
export type AnswerOption = {
  key: string;
  label: string;
  shortLabel: string;
  /** Fallback color hex used when no theme is active or no semantic tier is set. */
  color: string;
  /** Optional icon identifier. See AVAILABLE_ICONS in AnswerSchemaEditor. */
  icon?: string;
  /** Semantic tier for theme-aware coloring. */
  semantic?: AnswerSemantic;
  /**
   * How this option should be rendered. Defaults to "text" when omitted so
   * older data continues to render in label/pill mode.
   */
  display?: AnswerDisplay;
};

/** Returns the effective display mode for an option, defaulting to "text". */
export function getOptionDisplay(option: AnswerOption): AnswerDisplay {
  return option.display ?? "text";
}

/**
 * Preset color palette for answer options.
 * Warm, muted pastels that harmonize with the app's paper aesthetic and
 * provide enough contrast for white text overlays.
 */
export const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: "Lavender", hex: "#9C7DB5" },
  { name: "Sky", hex: "#7094B0" },
  { name: "Pistachio", hex: "#8A9B58" },
  { name: "Sand", hex: "#C5A958" },
  { name: "Raspberry", hex: "#B5586A" },
  { name: "Sepia", hex: "#8D6A4F" },
  { name: "Limoncello", hex: "#B8A535" },
  { name: "Rose", hex: "#C0808A" },
  { name: "Coral", hex: "#CC7A68" },
  { name: "Peach", hex: "#D09468" },
  { name: "Mint", hex: "#68A58A" },
  { name: "Grey", hex: "#908A82" },
];

/** The built-in default answer options: a 5-point scale from strong positive to hard boundary. */
export const DEFAULT_ANSWER_OPTIONS: AnswerOption[] = [
  {
    key: "must",
    label: "Must Have",
    shortLabel: "Must",
    color: "#8d4f3f",
    icon: "exclamation",
    semantic: "must",
  },
  {
    key: "like",
    label: "Like",
    shortLabel: "Like",
    color: "#7c4f73",
    icon: "check",
    semantic: "like",
  },
  {
    key: "open",
    label: "Open to It",
    shortLabel: "Open",
    color: "#6a9878",
    icon: "thumbsup",
    semantic: "neutral",
  },
  {
    key: "maybe",
    label: "Maybe",
    shortLabel: "Maybe",
    color: "#c6a055",
    icon: "question",
    semantic: "maybe",
  },
  {
    key: "off_limits",
    label: "Off Limits",
    shortLabel: "Limit",
    color: "#aa6c67",
    icon: "minus",
    semantic: "dislike",
  },
  {
    key: "unset",
    label: "Unset",
    shortLabel: "Unset",
    color: "#b39a84",
    icon: "empty",
  },
];

/**
 * Default secondary answer options. Used as the prefill when a template
 * creator enables the secondary answer row. A simple 3-point "trend" scale
 * (Want less / Just right / Want more) plus the required unset entry.
 * Defaults to icon display so the secondary row reads compactly next to the
 * primary answer.
 */
export const DEFAULT_SECONDARY_OPTIONS: AnswerOption[] = [
  {
    key: "less",
    label: "Want less",
    shortLabel: "Less",
    color: "#aa6c67",
    icon: "minus",
    semantic: "dislike",
    display: "icon",
  },
  {
    key: "right",
    label: "Just right",
    shortLabel: "Right",
    color: "#6a9878",
    icon: "check",
    semantic: "neutral",
    display: "icon",
  },
  {
    key: "more",
    label: "Want more",
    shortLabel: "More",
    color: "#8d4f3f",
    icon: "exclamation",
    semantic: "must",
    display: "icon",
  },
  {
    key: "unset",
    label: "Unset",
    shortLabel: "Unset",
    color: "#b39a84",
    icon: "empty",
    display: "icon",
  },
];

/**
 * Returns the effective answer options for a form, falling back to defaults.
 */
export function getEffectiveAnswerOptions(
  answerOptions: AnswerOption[] | undefined,
): AnswerOption[] {
  return answerOptions && answerOptions.length > 0
    ? answerOptions
    : DEFAULT_ANSWER_OPTIONS;
}

/**
 * Returns the "unset" key for a given answer option set.
 * Always the last option in the array.
 */
export function getUnsetKey(answerOptions: AnswerOption[] | undefined): string {
  const options = getEffectiveAnswerOptions(answerOptions);
  return options[options.length - 1].key;
}

/**
 * Returns the next selection key in the cycle order.
 * Cycles through the answer options array, wrapping at the end.
 */
export function nextSelectionKey(
  currentKey: string,
  answerOptions: AnswerOption[] | undefined,
): string {
  const options = getEffectiveAnswerOptions(answerOptions);
  const currentIndex = options.findIndex((o) => o.key === currentKey);
  if (currentIndex === -1) return options[options.length - 1].key;
  return options[(currentIndex + 1) % options.length].key;
}

/**
 * Returns the resolved secondary options for a form. Unlike the primary
 * answer options, secondary options have no implicit fallback: if the
 * template did not opt in, this returns undefined and no secondary row
 * should render.
 */
export function getEffectiveSecondaryOptions(
  secondaryOptions: AnswerOption[] | undefined,
): AnswerOption[] | undefined {
  return secondaryOptions && secondaryOptions.length > 0
    ? secondaryOptions
    : undefined;
}

/** Returns the secondary "unset" key, or undefined if secondary is disabled. */
export function getSecondaryUnsetKey(
  secondaryOptions: AnswerOption[] | undefined,
): string | undefined {
  const options = getEffectiveSecondaryOptions(secondaryOptions);
  return options ? options[options.length - 1].key : undefined;
}

/** Cycles through secondary options. Returns undefined if secondary is disabled. */
export function nextSecondarySelectionKey(
  currentKey: string | undefined,
  secondaryOptions: AnswerOption[] | undefined,
): string | undefined {
  const options = getEffectiveSecondaryOptions(secondaryOptions);
  if (!options) return undefined;
  const fallback = options[options.length - 1].key;
  const currentIndex =
    currentKey === undefined
      ? -1
      : options.findIndex((o) => o.key === currentKey);
  if (currentIndex === -1) return fallback;
  return options[(currentIndex + 1) % options.length].key;
}

type TypeIdPOJO = { prefix: string; suffix: string };

const QuestionIDLiteral = "question";
type QuestionID = TypeID<typeof QuestionIDLiteral>;
export type QuestionPOJO = {
  id: TypeIdPOJO;
  selection: string;
  value: string;
  /** Optional secondary answer key. Absent when the template has no secondary schema. */
  secondarySelection?: string;
};

class Question {
  readonly id: QuestionID;
  readonly selection: string;
  readonly value: string;
  /** Secondary answer key, or undefined when no secondary schema applies. */
  readonly secondarySelection?: string;

  private constructor(
    id: QuestionID,
    selection: string,
    value: string,
    secondarySelection?: string,
  ) {
    this.id = id;
    this.selection = selection;
    this.value = value;
    this.secondarySelection = secondarySelection;
  }

  static new(value: string, unsetKey = Selection.UNSET as string): Question {
    return new Question(typeid(QuestionIDLiteral), unsetKey, value);
  }

  /** Create a Question with a deterministic ID suffix (for stable starter templates). */
  static withStableId(
    suffix: string,
    value: string,
    unsetKey = Selection.UNSET as string,
  ): Question {
    return new Question(new TypeID(QuestionIDLiteral, suffix), unsetKey, value);
  }

  static fromPOJO(
    obj: QuestionPOJO,
    answerOptions?: AnswerOption[],
    secondaryOptions?: AnswerOption[],
  ): Question {
    if (obj.id.prefix !== QuestionIDLiteral) {
      throw new Error("Invalid Question ID");
    }
    const options = getEffectiveAnswerOptions(answerOptions);
    const validKeys = options.map((o) => o.key);
    const selection = validKeys.includes(obj.selection)
      ? obj.selection
      : options[options.length - 1].key;

    // Resolve the secondary selection only if the template defines a
    // secondary schema. Stored data that lacks a secondary value is left
    // undefined rather than back-filled with an unset key, so that adding
    // a secondary schema later doesn't silently mark old questions as
    // having a (default) secondary answer.
    let secondarySelection: string | undefined;
    const sOptions = getEffectiveSecondaryOptions(secondaryOptions);
    if (sOptions && typeof obj.secondarySelection === "string") {
      const validSecondary = sOptions.map((o) => o.key);
      secondarySelection = validSecondary.includes(obj.secondarySelection)
        ? obj.secondarySelection
        : sOptions[sOptions.length - 1].key;
    }

    return new Question(
      new TypeID(obj.id.prefix, obj.id.suffix),
      selection,
      obj.value,
      secondarySelection,
    );
  }

  withSelection(selection: string): Question {
    return new Question(
      this.id,
      selection,
      this.value,
      this.secondarySelection,
    );
  }

  withValue(value: string): Question {
    return new Question(
      this.id,
      this.selection,
      value,
      this.secondarySelection,
    );
  }

  withNextSelection(answerOptions?: AnswerOption[]): Question {
    return new Question(
      this.id,
      nextSelectionKey(this.selection, answerOptions),
      this.value,
      this.secondarySelection,
    );
  }

  withSecondarySelection(secondarySelection: string | undefined): Question {
    return new Question(
      this.id,
      this.selection,
      this.value,
      secondarySelection,
    );
  }

  withNextSecondarySelection(
    secondaryOptions: AnswerOption[] | undefined,
  ): Question {
    const next = nextSecondarySelectionKey(
      this.secondarySelection,
      secondaryOptions,
    );
    return new Question(this.id, this.selection, this.value, next);
  }

  /** @deprecated Use nextSelectionKey() with answer options instead. */
  static nextSelection(selection: Selection): Selection {
    switch (selection) {
      case Selection.MUST_HAVE:
        return Selection.LIKE;
      case Selection.LIKE:
        return Selection.OPEN_TO_IT;
      case Selection.OPEN_TO_IT:
        return Selection.MAYBE;
      case Selection.MAYBE:
        return Selection.OFF_LIMITS;
      case Selection.OFF_LIMITS:
        return Selection.UNSET;
      case Selection.UNSET:
        return Selection.MUST_HAVE;
      default:
        return Selection.UNSET;
    }
  }
}

const CategoryIDLiteral = "category";
type CategoryID = TypeID<typeof CategoryIDLiteral>;
export type CategoryPOJO = {
  id: TypeIdPOJO;
  name: string;
  questions: QuestionPOJO[];
};

class Category {
  readonly id: CategoryID;
  readonly name: string;
  readonly questions: Question[];

  private constructor(id: CategoryID, name: string, questions: Question[]) {
    this.id = id;
    this.name = name;
    this.questions = questions;
  }

  static new(name: string, questions: Question[]): Category {
    return new Category(typeid(CategoryIDLiteral), name, questions);
  }

  /** Create a Category with a deterministic ID suffix (for stable starter templates). */
  static withStableId(
    suffix: string,
    name: string,
    questions: Question[],
  ): Category {
    return new Category(new TypeID(CategoryIDLiteral, suffix), name, questions);
  }

  static fromPOJO(
    obj: CategoryPOJO,
    answerOptions?: AnswerOption[],
    secondaryOptions?: AnswerOption[],
  ): Category {
    if (obj.id.prefix !== CategoryIDLiteral) {
      throw new Error("Invalid Category ID");
    }
    return new Category(
      new TypeID(obj.id.prefix, obj.id.suffix),
      obj.name,
      obj.questions.map((q) =>
        Question.fromPOJO(q, answerOptions, secondaryOptions),
      ),
    );
  }

  withName(name: string): Category {
    return new Category(this.id, name, this.questions);
  }

  withQuestions(questions: Question[]): Category {
    return new Category(this.id, this.name, questions);
  }

  withQuestion(
    questionID: QuestionID,
    modifier: (question: Question) => Question,
  ): Category {
    const updatedQuestions = this.questions.map((q) =>
      q.id === questionID ? modifier(q) : q,
    );
    return new Category(this.id, this.name, updatedQuestions);
  }

  withMovedQuestion(
    questionID: QuestionID,
    direction: "up" | "down",
  ): Category {
    const index = this.questions.findIndex(
      (question) => question.id === questionID,
    );
    if (index === -1) return this;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= this.questions.length) return this;

    const newQuestions = [...this.questions];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = this.questions[index];
    return new Category(this.id, this.name, newQuestions);
  }

  addQuestion(question: Question): Category {
    return new Category(this.id, this.name, [...this.questions, question]);
  }

  removeQuestion(questionID: QuestionID): Category {
    return new Category(
      this.id,
      this.name,
      this.questions.filter((q) => q.id !== questionID),
    );
  }

  withoutAnswers(unsetKey: string = Selection.UNSET): Category {
    return new Category(
      this.id,
      this.name,
      this.questions.map((question) => {
        const cleared =
          question.selection === unsetKey
            ? question
            : question.withSelection(unsetKey);
        return cleared.secondarySelection === undefined
          ? cleared
          : cleared.withSecondarySelection(undefined);
      }),
    );
  }
}

export type FormPOJO = {
  name: string;
  categories: CategoryPOJO[];
  answerOptions?: AnswerOption[];
  /** Optional secondary answer schema for templates that opt in. */
  secondaryOptions?: AnswerOption[];
  /**
   * Filler-controlled toggle: when true, the form-fill UI shows a second
   * selection button per question. Only meaningful when secondaryOptions
   * is defined.
   */
  secondaryInputEnabled?: boolean;
  templateName?: string;
  respondentName?: string;
  description?: string;
};

class Form {
  readonly name: string;
  readonly categories: Category[];
  readonly answerOptions?: AnswerOption[];
  readonly secondaryOptions?: AnswerOption[];
  readonly secondaryInputEnabled?: boolean;
  readonly templateName?: string;
  readonly respondentName?: string;
  readonly description?: string;

  private constructor(
    name: string,
    categories: Category[],
    answerOptions?: AnswerOption[],
    secondaryOptions?: AnswerOption[],
    secondaryInputEnabled?: boolean,
    templateName?: string,
    respondentName?: string,
    description?: string,
  ) {
    this.name = name;
    this.categories = categories;
    this.answerOptions = answerOptions;
    this.secondaryOptions = secondaryOptions;
    this.secondaryInputEnabled = secondaryInputEnabled;
    this.templateName = templateName;
    this.respondentName = respondentName;
    this.description = description;
  }

  static new(
    name: string,
    categories: Category[],
    answerOptions?: AnswerOption[],
    description?: string,
    secondaryOptions?: AnswerOption[],
  ): Form {
    return new Form(
      name,
      categories,
      answerOptions,
      secondaryOptions,
      undefined,
      undefined,
      undefined,
      description,
    );
  }

  static fromPOJO(obj: FormPOJO): Form {
    const secondaryOptions = getEffectiveSecondaryOptions(obj.secondaryOptions);
    return new Form(
      obj.name,
      obj.categories.map((c) =>
        Category.fromPOJO(c, obj.answerOptions, secondaryOptions),
      ),
      obj.answerOptions,
      secondaryOptions,
      typeof obj.secondaryInputEnabled === "boolean"
        ? obj.secondaryInputEnabled
        : undefined,
      obj.templateName,
      obj.respondentName,
      typeof obj.description === "string" ? obj.description : undefined,
    );
  }

  getCategory(categoryID: CategoryID): Category | undefined {
    return this.categories.find((category) => category.id === categoryID);
  }

  withName(name: string): Form {
    return new Form(
      name,
      this.categories,
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  withDescription(description: string): Form {
    return new Form(
      this.name,
      this.categories,
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      description,
    );
  }

  withCategories(categories: Category[]): Form {
    return new Form(
      this.name,
      categories,
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  withAnswerOptions(answerOptions: AnswerOption[] | undefined): Form {
    return new Form(
      this.name,
      this.categories,
      answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  withSecondaryOptions(secondaryOptions: AnswerOption[] | undefined): Form {
    return new Form(
      this.name,
      this.categories,
      this.answerOptions,
      secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  withSecondaryInputEnabled(enabled: boolean | undefined): Form {
    return new Form(
      this.name,
      this.categories,
      this.answerOptions,
      this.secondaryOptions,
      enabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  withTemplateName(templateName: string): Form {
    return new Form(
      this.name,
      this.categories,
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      templateName,
      this.respondentName,
      this.description,
    );
  }

  withRespondentName(respondentName: string): Form {
    return new Form(
      this.name,
      this.categories,
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      respondentName,
      this.description,
    );
  }

  withCategory(
    categoryID: CategoryID,
    modifier: (category: Category) => Category,
  ): Form {
    const updatedCategories = this.categories.map((c) =>
      c.id === categoryID ? modifier(c) : c,
    );
    return new Form(
      this.name,
      updatedCategories,
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  withMovedCategory(categoryID: CategoryID, direction: "up" | "down"): Form {
    const index = this.categories.findIndex(
      (category) => category.id === categoryID,
    );
    if (index === -1) return this;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= this.categories.length) return this;

    const newCategories = [...this.categories];
    newCategories[index] = newCategories[newIndex];
    newCategories[newIndex] = this.categories[index];
    return new Form(
      this.name,
      newCategories,
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  addCategory(category: Category): Form {
    return new Form(
      this.name,
      [...this.categories, category],
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  removeCategory(categoryID: CategoryID): Form {
    return new Form(
      this.name,
      this.categories.filter((c) => c.id !== categoryID),
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  withoutAnswers(): Form {
    const unsetKey = getUnsetKey(this.answerOptions);
    return new Form(
      this.name,
      this.categories.map((category) => category.withoutAnswers(unsetKey)),
      this.answerOptions,
      this.secondaryOptions,
      this.secondaryInputEnabled,
      this.templateName,
      this.respondentName,
      this.description,
    );
  }

  questionCount(): number {
    return this.categories.reduce(
      (count, category) => count + category.questions.length,
      0,
    );
  }

  hasValidStructure(): boolean {
    return this.categories.length > 0 && this.questionCount() > 0;
  }

  getStatistics(): Record<string, number> {
    return this.categories.reduce(
      (acc, category) => {
        for (const question of category.questions) {
          acc[question.selection] = (acc[question.selection] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  static example(): Form {
    return new Form("Test Form", [
      Category.new("First Category", [
        Question.new("Must Have Question").withSelection(Selection.MUST_HAVE),
        Question.new("Like Question").withSelection(Selection.LIKE),
        Question.new("Open to It Question").withSelection(Selection.OPEN_TO_IT),
        Question.new("Maybe Question").withSelection(Selection.MAYBE),
        Question.new("Off Limits Question").withSelection(Selection.OFF_LIMITS),
      ]),
      Category.new("Second Category", [
        Question.new("First Question").withSelection(Selection.MUST_HAVE),
        Question.new("Second Question").withSelection(Selection.LIKE),
        Question.new("Third Question").withSelection(Selection.MAYBE),
      ]),
    ]);
  }

  static generateTsRepresenation(form: Form): string {
    const tsRepresentation: string[] = [`Form.new('${form.name}', [`];
    form.categories.forEach((category) => {
      tsRepresentation.push(`  Category.new('${category.name}', [`);
      category.questions.forEach((question) => {
        tsRepresentation.push(`    Question.new('${question.value}'),`);
      });
      tsRepresentation.push("  ]),");
    });
    tsRepresentation.push("]);");
    return tsRepresentation.join("\n");
  }
}

/**
 * Returns true when the form has at least one non-unset secondary answer.
 * Used by shared/read-only and compare views to hide the secondary row
 * for forms that did not actually use it.
 */
export function formHasSecondaryAnswers(form: Form): boolean {
  const unsetKey = getSecondaryUnsetKey(form.secondaryOptions);
  if (unsetKey === undefined) return false;
  for (const category of form.categories) {
    for (const question of category.questions) {
      if (
        question.secondarySelection !== undefined &&
        question.secondarySelection !== unsetKey
      ) {
        return true;
      }
    }
  }
  return false;
}

export type { CategoryID, QuestionID };
export { Category, Form, Question, Selection };
