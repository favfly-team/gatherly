import { Button as ButtonComponent } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Button = ({ children, isLoading, ...props }) => {
  return (
    <ButtonComponent disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </ButtonComponent>
  );
};

export default Button;
