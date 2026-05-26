import type React from "react";
import FormHeader from "./FormHeader";

interface DocumentPageShellProps {
  formName: string;
  isEncrypted: boolean;
  readOnly?: boolean;
  onFormNameChange?: (name: string) => void;
  respondentName?: string;
  onRespondentNameChange?: (name: string) => void;
  description?: string;
  onDescriptionChange?: (description: string) => void;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  notice?: React.ReactNode;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

export default function DocumentPageShell({
  formName,
  isEncrypted,
  readOnly = false,
  onFormNameChange,
  respondentName,
  onRespondentNameChange,
  description,
  onDescriptionChange,
  actions,
  badge,
  notice,
  overlay,
  children,
}: DocumentPageShellProps) {
  return (
    <>
      <FormHeader
        formName={formName}
        isEncrypted={isEncrypted}
        onFormNameChange={onFormNameChange}
        readOnly={readOnly}
        respondentName={respondentName}
        onRespondentNameChange={onRespondentNameChange}
        description={description}
        onDescriptionChange={onDescriptionChange}
        badge={badge}
      />

      {actions}
      {notice}
      {overlay}
      {children}
    </>
  );
}
