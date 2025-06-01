import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import InputPassword from "./input-password";
import InputSelect from "./input-select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const FormInput = forwardRef(
  ({ name, type = "text", placeholder, className, ...props }, ref) => {
    switch (type) {
      case "text":
      case "email":
        return (
          <Input
            ref={ref}
            type={type}
            name={name}
            placeholder={placeholder}
            className={cn("w-full", className)}
            {...props}
          />
        );
      case "password":
        return <InputPassword {...props} />;
      case "textarea":
        return <Textarea {...props} />;
      case "select":
        return <InputSelect {...props} />;
      default:
        return (
          <Input
            ref={ref}
            type={type}
            name={name}
            placeholder={placeholder}
            className={cn("w-full", className)}
            {...props}
          />
        );
    }
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
