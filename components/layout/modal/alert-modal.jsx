import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/layout/dialog/dialog";

const AlertModal = ({
  isOpen,
  setIsOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  isLoading,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      description={description}
    >
      <div className="flex gap-4 justify-end mt-4">
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>

        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin duration-300" />}
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
};

export default AlertModal;
