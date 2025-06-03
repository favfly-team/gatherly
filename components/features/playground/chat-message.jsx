"use client";
import { cn } from "@/lib/utils";
// import { User, Bot } from "lucide-react";
import { marked } from "marked";

export default function ChatMessage({ role, content }) {
  return (
    <div
      className={cn(
        "flex gap-2",
        role === "user" ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
        {role === "user" ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-muted-foreground" />
        )}
      </div> */}
      <div
        className={cn(
          "rounded-lg max-w-[80%] whitespace-pre-line",
          role === "user" ? "bg-accent rounded-3xl px-5 py-[10px]" : ""
        )}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: marked.parseInline(content),
          }}
        />
      </div>
    </div>
  );
}
