import {
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  PlayIcon,
  PrinterIcon,
  ScaleIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useFormActions } from "../contexts/FormActionsContext";
import { createCompareSession } from "../utils/compareSession";
import { printCurrentView } from "../utils/formActions";
import ExportModal from "./ExportModal";
import PageActionRails from "./PageActionRails";

type ActionConfig = {
  key: string;
  label: string;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  variant: "default" | "success" | "info" | "danger";
  icon: React.ReactElement;
};

export default function FormActionButtons() {
  const {
    formId,
    isPublished,
    isPublishing,
    isCloning,
    isDeleting,
    handleClone,
    handleStartFresh,
    handleCreateTemplateDraft,
    handleExportCSV,
    handleExportJSON,
    handleDelete,
    handlePublish,
    handleShare,
  } = useFormActions();

  const router = useRouter();
  const [showExportModal, setShowExportModal] = useState(false);

  const leftActions: ActionConfig[] = [];
  if (isPublished) {
    leftActions.push({
      key: "clone",
      label: "New Draft",
      onClick: handleClone,
      title: "Create a copy with your current answers",
      disabled: isCloning,
      variant: "default",
      icon: <DocumentDuplicateIcon className="h-5 w-5" />,
    });
    leftActions.push({
      key: "start-fresh",
      label: "Start Fresh",
      onClick: handleStartFresh,
      title: "Start a new response with fresh answers",
      variant: "success",
      icon: <PlayIcon className="h-5 w-5" />,
    });
    leftActions.push({
      key: "new-template",
      label: "New Template",
      onClick: handleCreateTemplateDraft,
      title: "Create a template draft from this structure",
      variant: "default",
      icon: <PencilSquareIcon className="h-5 w-5" />,
    });
    leftActions.push({
      key: "compare",
      label: "Compare",
      onClick: () => {
        if (!formId) return;
        router.push(
          `/compare?local=${encodeURIComponent(
            createCompareSession(localStorage, [formId]),
          )}`,
        );
      },
      title: "Compare with other responses",
      variant: "info",
      icon: <ScaleIcon className="h-5 w-5" />,
    });
  }

  if (handleDelete) {
    leftActions.push({
      key: "delete",
      label: "Delete",
      onClick: handleDelete,
      title: "Delete Response",
      disabled: isDeleting,
      variant: "danger",
      icon: <TrashIcon className="h-5 w-5" />,
    });
  }

  const rightActions: ActionConfig[] = [];
  rightActions.push({
    key: "export",
    label: "Export",
    onClick: () => setShowExportModal(true),
    title: "Export data",
    variant: "info",
    icon: <ArrowDownTrayIcon className="h-5 w-5" />,
  });

  rightActions.push({
    key: "print",
    label: "Print",
    onClick: printCurrentView,
    title: "Print this view",
    variant: "default",
    icon: <PrinterIcon className="h-5 w-5" />,
  });

  if (!isPublished && handlePublish) {
    rightActions.push({
      key: "publish",
      label: "Publish",
      onClick: handlePublish,
      title: "Publish Response",
      disabled: isPublishing,
      variant: "success",
      icon: <CloudArrowUpIcon className="h-5 w-5" />,
    });
  }

  if (isPublished && handleShare) {
    rightActions.push({
      key: "share",
      label: "Share",
      onClick: handleShare,
      title: "Share Response",
      variant: "info",
      icon: <ShareIcon className="h-5 w-5" />,
    });
  }

  return (
    <>
      <PageActionRails leftActions={leftActions} rightActions={rightActions} />
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        documentLabel="this response"
      />
    </>
  );
}
