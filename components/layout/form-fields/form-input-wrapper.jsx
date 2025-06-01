import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cloneElement } from "react";

const FormInputWrapper = forwardRef(({ children, form, className }, ref) => {
  const { name, label } = children.props;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>{cloneElement(children, { ...field })}</FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

FormInputWrapper.displayName = "FormInputWrapper";

export default FormInputWrapper;
