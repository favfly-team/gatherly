import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const SyncLoading = ({ className }) => {
  return (
    <div
      className={`flex items-center justify-center w-full h-full ${cn(
        "bg-white dark:bg-gray-900",
        className
      )}`}
    >
      <Loader2 className="animate-spin duration-300 text-gray-500" size={30} />
    </div>
  );
};

export default SyncLoading;
