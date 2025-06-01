"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const InputRating = ({
  value,
  onChange,
  ratingLength = 5,
  size = 20,
  isLoading,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  if (isLoading)
    return (
      <div className="flex items-center gap-2">
        {Array.from({ length: ratingLength }, (_, index) => (
          <div key={index} className="animate-pulse">
            <Star size={size} className="text-gray-200 fill-gray-200" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: ratingLength }, (_, index) => (
        <Star
          key={index}
          size={size}
          className={cn("text-gray-200 cursor-pointer", {
            "!fill-yellow-500 !text-yellow-500":
              index < hoverRating || index < value,
          })}
          onClick={() => onChange(index + 1)}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default InputRating;
