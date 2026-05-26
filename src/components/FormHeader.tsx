import type React from "react";
import EncryptionStatus from "./EncryptionStatus";

interface FormHeaderProps {
  formName: string;
  isEncrypted: boolean;
  onFormNameChange?: (name: string) => void;
  readOnly?: boolean;
  respondentName?: string;
  onRespondentNameChange?: (name: string) => void;
  description?: string;
  onDescriptionChange?: (description: string) => void;
  badge?: React.ReactNode;
}

export default function FormHeader({
  formName,
  isEncrypted,
  onFormNameChange,
  readOnly = false,
  respondentName,
  onRespondentNameChange,
  description,
  onDescriptionChange,
  badge,
}: FormHeaderProps) {
  const hasRespondentField =
    onRespondentNameChange !== undefined || respondentName !== undefined;

  return (
    <>
      {badge && (
        <div className="absolute top-1 right-1 z-10 max-w-5 table">{badge}</div>
      )}
      <div className="document-sheet relative mb-4">
        {/* Title: always read-only when respondent field is shown */}
        <div className="mb-4 flex items-center justify-center gap-2 text-center">
          {readOnly || hasRespondentField ? (
            <div
              id="form-name"
              className="max-w-full border-b-1 bg-transparent text-center text-2xl"
            >
              {formName}
            </div>
          ) : (
            <>
              <label htmlFor="form-name" className="sr-only">
                Form title
              </label>
              <input
                id="form-name"
                type="text"
                className="w-fit max-w-full border-b-1 bg-transparent text-center text-2xl focus:outline-none"
                value={formName}
                onChange={(e) => onFormNameChange?.(e.target.value)}
                placeholder="Title"
                disabled={readOnly}
                name="form-name"
              />
            </>
          )}
          <EncryptionStatus isEncrypted={isEncrypted} showText={false} />
        </div>

        {(description || onDescriptionChange) && (
          <div className="mx-auto mb-4 max-w-full text-center">
            {onDescriptionChange && !readOnly ? (
              <>
                <label htmlFor="document-description" className="sr-only">
                  Template description
                </label>
                <textarea
                  id="document-description"
                  className="paper-field min-h-8 w-full resize-none border-b border-th-line text-center text-sm leading-5 text-th-ink-muted focus:outline-none"
                  value={description ?? ""}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Add a short description to help people get in the right mindset."
                  name="document-description"
                  rows={2}
                />
              </>
            ) : (
              <p className="text-sm leading-5 text-th-ink-muted">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Respondent name input for forms */}
        {onRespondentNameChange && !readOnly && (
          <div className="flex items-center justify-center gap-2 text-center">
            <label
              htmlFor="respondent-name"
              className="text-sm text-th-ink-muted"
            >
              Your Name
            </label>
            <input
              id="respondent-name"
              type="text"
              className="w-48 max-w-full border-b-1 bg-transparent text-center text-base focus:outline-none"
              value={respondentName ?? ""}
              onChange={(e) => onRespondentNameChange(e.target.value)}
              placeholder="Enter your name"
              name="respondent-name"
            />
          </div>
        )}

        {/* Respondent name display for read-only forms */}
        {hasRespondentField && readOnly && respondentName && (
          <div className="flex items-center justify-center gap-1 text-center text-sm text-th-ink-muted">
            Filled by {respondentName}
          </div>
        )}
      </div>
    </>
  );
}
