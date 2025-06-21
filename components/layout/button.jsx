import { Button as ButtonComponent } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Button = ({ children, isLoading, icon = null, ...props }) => {
  return (
    <ButtonComponent disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </ButtonComponent>
  );
};

export default Button;
