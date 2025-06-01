"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const InputPassword = ({ ...field }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input {...field} type={showPassword ? "text" : "password"} />

      <i
        onClick={handleTogglePassword}
        className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </i>
    </div>
  );
};

export default InputPassword;
