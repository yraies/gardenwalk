import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/16/solid";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportCSV?: () => void;
  documentLabel?: string;
}

export default function ExportModal({
  isOpen,
  onClose,
  onExportJSON,
  onExportCSV,
  documentLabel = "this document",
}: ExportModalProps) {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    onExportJSON();
    onClose();
  };

  const handleExportCSV = () => {
    onExportCSV?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 print:hidden">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="w-full max-w-md border border-th-line bg-th-paper p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <ArrowDownTrayIcon
              className="mt-0.5 h-6 w-6 text-th-ink-muted"
              aria-hidden="true"
            />
            <div>
              <h2 id="export-modal-title" className="text-lg font-semibold">
                Export
              </h2>
              <p className="mt-1 text-sm text-th-ink-muted">
                Export downloads the data for {documentLabel} so you can keep
                it, move it, inspect it, or use it however you want outside
                Garden Walk.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-th-ink-muted hover:text-th-ink"
            aria-label="Close export options"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="border border-th-line px-4 py-2 text-left text-sm font-semibold hover:bg-th-paper-soft"
          >
            Download JSON
            <span className="block text-xs font-normal text-th-ink-muted">
              Best for backup, re-import, and preserving the full structure.
            </span>
          </button>
          {onExportCSV && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="border border-th-line px-4 py-2 text-left text-sm font-semibold hover:bg-th-paper-soft"
            >
              Download CSV
              <span className="block text-xs font-normal text-th-ink-muted">
                Best for spreadsheets and simple tabular review.
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
