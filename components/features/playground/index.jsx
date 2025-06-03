"use client";
import PromptPanel from "./prompt-panel";
import ChatPanel from "./chat-panel";
import { Card } from "@/components/ui/card";

export default function PlaygroundChat() {
  return (
    <div className="flex h-full border rounded-lg bg-background shadow">
      <div className="w-1/2 h-full">
        <PromptPanel />
      </div>
      <div className="w-1/2 h-[calc(100vh-90px)]">
        <ChatPanel />
      </div>
    </div>
  );
}

// ChatOnly: just the chat window, no prompt panel
export function ChatOnly() {
  return (
    <div className="bg-background">
      <div className="w-full h-screen flex flex-col items-center">
        {/* Header */}
        <div className="flex justify-center items-end pt-4 pb-5 px-4 border-b border-border w-full">
          <div className="flex items-center gap-2">
            <img
              src="https://images.prismic.io/favfly2/aD00h7h8WN-LVdrA_GatherlyLogo.png?auto=format,compress"
              alt="Gatherly Logo"
              fetchPriority="high"
              className="w-auto h-10"
            />
            <h4 className="text-xl font-bold">Gatherly</h4>
          </div>
          <sub className="bottom-[.05em] text-gray-500 dark:text-gray-400">
            by FavFly
          </sub>
        </div>

        {/* Chat Panel */}
        <div className="w-full h-[calc(100vh-80px)] p-4">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
