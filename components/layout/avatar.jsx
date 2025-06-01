import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import { cn } from "@/lib/utils";

const Avatar = ({ src = "", alt = "", name, className, fallbackClassName }) => {
  const initial =
    name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((word) => word.charAt(0)) || "U";

  return (
    <AvatarComponent className={cn(className, "static")}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className={fallbackClassName}>{initial}</AvatarFallback>
    </AvatarComponent>
  );
};

export default Avatar;
