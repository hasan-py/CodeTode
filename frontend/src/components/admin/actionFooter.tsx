import { LoaderCircle } from "lucide-react";
import React, { type MouseEvent } from "react";
import Button from "../common/button";

interface ActionFooterProps {
  onResetClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  isResetDisabled?: boolean;

  onCancelClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  isCancelDisabled?: boolean;

  onSaveClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  isSaveDisabled?: boolean;

  disabled?: boolean;
  isLoading?: boolean;
  saveBtnTitle?: string;
}

const ActionFooter: React.FC<ActionFooterProps> = ({
  onResetClick,
  isResetDisabled = false,
  onCancelClick,
  isCancelDisabled = false,
  onSaveClick,
  isSaveDisabled = false,
  disabled = false,
  isLoading = false,
  saveBtnTitle = "Save",
}) => {
  return (
    <div className="flex justify-end space-x-4 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
      {onResetClick && (
        <Button
          variant="outline"
          onClick={onResetClick}
          disabled={isResetDisabled || disabled}
        >
          Reset
        </Button>
      )}

      {onCancelClick && (
        <Button
          variant="secondary"
          onClick={onCancelClick}
          disabled={isCancelDisabled || disabled}
        >
          Cancel
        </Button>
      )}

      {onSaveClick && (
        <Button
          icon={
            isLoading ? (
              <LoaderCircle className="animate-spin" aria-label="Loading" />
            ) : null
          }
          onClick={onSaveClick}
          disabled={isSaveDisabled || disabled}
        >
          {saveBtnTitle}
        </Button>
      )}
    </div>
  );
};

export default ActionFooter;
