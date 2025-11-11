import { CheckCheck, SortAscIcon, X } from "lucide-react";
import Button from "./button";

interface IReorderButtonsProps {
  visible: boolean;
  isReorderMode: boolean;
  cancelChanges: () => void;
  isUpdating: boolean;
  toggleReorderMode: () => void;
}

function ReorderButtons({
  visible,
  isReorderMode,
  cancelChanges,
  isUpdating,
  toggleReorderMode,
}: IReorderButtonsProps) {
  if (!visible) return null;

  return (
    <div className="flex gap-2">
      {isReorderMode && (
        <Button
          variant="danger"
          icon={<X />}
          onClick={cancelChanges}
          disabled={isUpdating}
        />
      )}

      <Button
        variant={isReorderMode ? "success" : "outline"}
        icon={isReorderMode ? <CheckCheck /> : <SortAscIcon />}
        onClick={toggleReorderMode}
        disabled={isUpdating}
      />
    </div>
  );
}

export default ReorderButtons;
