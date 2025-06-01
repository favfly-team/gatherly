import { Form as FormComponent } from "@/components/ui/form";
import SubmitButton from "./submit-button";
import FormInputWrapper from "./form-input-wrapper";
import FormInput from "./form-input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Form = forwardRef(
  (
    {
      form,
      onSubmit,
      fields,
      submitLabel,
      className,
      groupClassName,
      submitButtonClassName,
      buttonChildren,
    },
    ref
  ) => {
    return (
      <FormComponent {...form}>
        <form
          ref={ref}
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-4", className)}
        >
          {fields.map((field) => {
            if (field.groupName) {
              return (
                <div key={field.groupName}>
                  <h3 className="text-lg font-medium mb-2">
                    {field.groupName}
                  </h3>

                  <div className={cn("space-y-4", groupClassName)}>
                    {field.fields.map((field) => (
                      <FormInputWrapper key={field.name} form={form}>
                        <FormInput {...field} />
                      </FormInputWrapper>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <FormInputWrapper key={field.name} form={form}>
                  <FormInput {...field} />
                </FormInputWrapper>
              );
            }
          })}

          <div className="flex justify-start gap-4 items-center w-full col-span-full">
            <SubmitButton
              form={form}
              label={submitLabel}
              className={submitButtonClassName}
            />
            {buttonChildren && buttonChildren}
          </div>
        </form>
      </FormComponent>
    );
  }
);

Form.displayName = "Form";

export default Form;
