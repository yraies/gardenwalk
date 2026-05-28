import {
  type AnswerOption,
  Category,
  DEFAULT_SECONDARY_OPTIONS,
  Form,
  formHasSecondaryAnswers,
  getOptionDisplay,
  getUnsetKey,
  Question,
} from "../Form";

const CUSTOM_OPTIONS: AnswerOption[] = [
  { key: "yes", label: "Yes", shortLabel: "Y", color: "#00aa00" },
  { key: "no", label: "No", shortLabel: "N", color: "#aa0000" },
  { key: "blank", label: "Blank", shortLabel: "-", color: "#999999" },
];

describe("template editing model behavior", () => {
  test("new categories use the template's current unset key", () => {
    const form = Form.new("Template", [], CUSTOM_OPTIONS);

    const updated = form.addCategory(
      Category.new("", [Question.new("", getUnsetKey(form.answerOptions))]),
    );

    expect(updated.categories[0].questions[0].selection).toBe("blank");
  });

  test("new questions use the template's current unset key", () => {
    const form = Form.new(
      "Template",
      [Category.new("Category", [Question.new("Existing", "blank")])],
      CUSTOM_OPTIONS,
    );

    const categoryId = form.categories[0].id;
    const updated = form.withCategory(categoryId, (category) =>
      category.addQuestion(Question.new("", getUnsetKey(form.answerOptions))),
    );

    expect(updated.categories[0].questions[1].selection).toBe("blank");
  });

  test("withMovedCategory reorders categories", () => {
    const form = Form.new("Template", [
      Category.new("First", [Question.new("Q1")]),
      Category.new("Second", [Question.new("Q2")]),
    ]);

    const updated = form.withMovedCategory(form.categories[1].id, "up");

    expect(updated.categories.map((category) => category.name)).toEqual([
      "Second",
      "First",
    ]);
  });

  test("withMovedQuestion reorders questions within a category", () => {
    const category = Category.new("Category", [
      Question.new("First"),
      Question.new("Second"),
    ]);

    const updated = category.withMovedQuestion(category.questions[1].id, "up");

    expect(updated.questions.map((question) => question.value)).toEqual([
      "Second",
      "First",
    ]);
  });

  test("description is optional for backward-compatible imports", () => {
    const form = Form.fromPOJO({
      name: "Legacy Template",
      categories: [
        {
          id: { prefix: "category", suffix: "00000000000000000000000000" },
          name: "Category",
          questions: [
            {
              id: { prefix: "question", suffix: "00000000000000000000000001" },
              selection: "unset",
              value: "Question",
            },
          ],
        },
      ],
    });

    expect(form.description).toBeUndefined();
  });

  test("description survives form transformations", () => {
    const form = Form.new("Template", [], undefined, "A helpful framing note.");

    expect(form.withName("Renamed").description).toBe(
      "A helpful framing note.",
    );
    expect(form.withoutAnswers().description).toBe("A helpful framing note.");
  });

  test("answer option display defaults to text and round-trips through fromPOJO", () => {
    const optionsWithoutDisplay: AnswerOption[] = [
      { key: "yes", label: "Yes", shortLabel: "Y", color: "#00aa00" },
      { key: "blank", label: "Blank", shortLabel: "-", color: "#999999" },
    ];
    expect(getOptionDisplay(optionsWithoutDisplay[0])).toBe("text");

    // When the schema-level toggle sets all options to "icon"
    const optionsAllIcon: AnswerOption[] = [
      {
        key: "yes",
        label: "Yes",
        shortLabel: "Y",
        color: "#00aa00",
        display: "icon",
      },
      {
        key: "blank",
        label: "Blank",
        shortLabel: "-",
        color: "#999999",
        display: "icon",
      },
    ];

    const form = Form.fromPOJO({
      name: "Template",
      categories: [],
      answerOptions: optionsAllIcon,
    });

    expect(form.answerOptions?.[0].display).toBe("icon");
    expect(form.answerOptions?.[1].display).toBe("icon");
  });

  test("secondary options and selections round-trip through fromPOJO", () => {
    const form = Form.new(
      "Template",
      [Category.new("Category", [Question.new("Question", "unset")])],
      undefined,
      undefined,
      DEFAULT_SECONDARY_OPTIONS,
    ).withSecondaryInputEnabled(true);

    const q = form.categories[0].questions[0];
    const formWithSecondary = form.withCategory(form.categories[0].id, (cat) =>
      cat.withQuestion(q.id, (qq) => qq.withSecondarySelection("more")),
    );

    expect(formHasSecondaryAnswers(formWithSecondary)).toBe(true);

    const roundTrip = Form.fromPOJO(
      JSON.parse(JSON.stringify(formWithSecondary)),
    );
    expect(roundTrip.secondaryOptions?.length).toBe(
      DEFAULT_SECONDARY_OPTIONS.length,
    );
    expect(roundTrip.secondaryInputEnabled).toBe(true);
    expect(roundTrip.categories[0].questions[0].secondarySelection).toBe(
      "more",
    );
    expect(formHasSecondaryAnswers(roundTrip)).toBe(true);
  });

  test("formHasSecondaryAnswers is false when all secondary selections are unset or missing", () => {
    const form = Form.new(
      "Template",
      [Category.new("Category", [Question.new("Question", "unset")])],
      undefined,
      undefined,
      DEFAULT_SECONDARY_OPTIONS,
    );
    expect(formHasSecondaryAnswers(form)).toBe(false);
  });

  test("withoutAnswers clears secondary selections", () => {
    const form = Form.new(
      "Template",
      [Category.new("Category", [Question.new("Question", "unset")])],
      undefined,
      undefined,
      DEFAULT_SECONDARY_OPTIONS,
    );
    const q = form.categories[0].questions[0];
    const withAnswer = form.withCategory(form.categories[0].id, (cat) =>
      cat.withQuestion(q.id, (qq) => qq.withSecondarySelection("more")),
    );
    expect(
      withAnswer.withoutAnswers().categories[0].questions[0].secondarySelection,
    ).toBeUndefined();
  });
});
