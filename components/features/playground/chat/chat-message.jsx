"use client";
import { cn } from "@/lib/utils";
import { marked } from "marked";

export default function ChatMessage({ role, content }) {
  return (
    <div
      className={cn(
        "flex gap-2",
        role === "user" ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "rounded-lg max-w-[80%] whitespace-pre-line",
          role === "user" ? "bg-accent rounded-3xl px-5 py-[10px]" : ""
        )}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: content
              ? marked
                  ?.parseInline(content?.replaceAll("###GATHERLY_DONE###", ""))
                  ?.replace(
                    /<a href="(.*?)"/g,
                    '<a href="$1" target="_blank" rel="noopener noreferrer"'
                  )
              : "",
          }}
        />
      </div>
    </div>
  );
}
