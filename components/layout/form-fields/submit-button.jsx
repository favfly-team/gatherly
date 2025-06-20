import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SubmitButton = ({ form, label, className, variant }) => {
  return (
    <Button
      type="submit"
      className={cn("w-full", className)}
      disabled={!form.formState.isValid || form.formState.isSubmitting}
      variant={variant}
    >
      {form.formState.isSubmitting && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {label}
    </Button>
  );
};

export default SubmitButton;
