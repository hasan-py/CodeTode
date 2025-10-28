import React from "react";
import Button from "../button";

interface AlertModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  open,
  title = "Archived Item",
  description = "Are you sure you want to archive this?",
  onConfirm,
  onCancel,
  confirmText = "Archived",
  cancelText = "Cancel",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 transition-colors">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-sm p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onCancel} type="button" variant="secondary">
            {cancelText}
          </Button>

          <Button onClick={onConfirm} type="button" variant="danger">
            {confirmText}
          </Button>
        </div>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeInScale 0.2s;
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95);}
          100% { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
};
