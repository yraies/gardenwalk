import { PlusIcon } from "@heroicons/react/16/solid";
import type { Dispatch, SetStateAction } from "react";
import type { AnswerOption, Category, Form } from "../types/Form";
import CategoryBox from "./CategoryPage";
import ResponseOptionsLegend from "./ResponseOptionsLegend";

interface FormCategoryListProps {
  setDocument?: Dispatch<SetStateAction<Form>>;
  categories: Category[];
  answerMode: "hidden" | "editable" | "readonly";
  structureEditable: boolean;
  showPrintResponseSpace?: boolean;
  showAddButton?: boolean;
  onAddCategory?: () => void;
  answerOptions?: AnswerOption[];
  secondaryOptions?: AnswerOption[];
  /** Whether to render the secondary answer button per question. */
  secondaryInputEnabled?: boolean;
}

export default function FormCategoryList({
  setDocument,
  categories,
  answerMode,
  structureEditable,
  showPrintResponseSpace = true,
  showAddButton = false,
  onAddCategory,
  answerOptions,
  secondaryOptions,
  secondaryInputEnabled = false,
}: FormCategoryListProps) {
  return (
    <main
      className="document-sheet form-categories not-print:flex not-print:flex-col not-print:gap-2"
      aria-label="Form categories"
    >
      {answerMode !== "hidden" && (
        <ResponseOptionsLegend
          answerOptions={answerOptions}
          secondaryOptions={
            secondaryInputEnabled ? secondaryOptions : undefined
          }
        />
      )}

      {categories.map((category) => (
        <CategoryBox
          category={category}
          key={category.id.toString()}
          setDocument={setDocument}
          answerMode={answerMode}
          structureEditable={structureEditable}
          showPrintResponseSpace={showPrintResponseSpace}
          answerOptions={answerOptions}
          secondaryOptions={secondaryOptions}
          secondaryInputEnabled={secondaryInputEnabled}
        />
      ))}

      {showAddButton && onAddCategory && (
        <button
          type="button"
          className="mx-auto mt-1 flex w-fit items-center justify-center gap-2 px-2 py-1 hover:backdrop-brightness-90 print:hidden"
          onClick={onAddCategory}
          aria-label="Add new category"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Add new category
        </button>
      )}
    </main>
  );
}
