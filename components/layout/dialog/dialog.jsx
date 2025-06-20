import {
  Dialog as DialogComponent,
  DialogContent,
} from "@/components/ui/dialog";
import Header from "./components/header";
import TriggerButton from "./components/trigger-button";
import { cn } from "@/lib/utils";

const Dialog = ({
  isOpen,
  setIsOpen,
  children,
  title,
  description,
  button,
  onOpenAutoFocus = true,
  className,
}) => {
  return (
    <DialogComponent open={isOpen} onOpenChange={setIsOpen}>
      {/* // ===== TRIGGER BUTTON ===== */}
      <TriggerButton button={button} />

      {/* // ===== DIALOG CONTENT ===== */}
      <DialogContent
        className={cn(
          "sm:max-w-[550px] max-h-[90vh] overflow-y-auto",
          className
        )}
        onOpenAutoFocus={
          onOpenAutoFocus ? undefined : (e) => e.preventDefault()
        }
      >
        <Header title={title} description={description} />

        {children}
      </DialogContent>
    </DialogComponent>
  );
};

export default Dialog;
