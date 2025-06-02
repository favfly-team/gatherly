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
      <div className="w-1/2 h-full">
        <ChatPanel />
      </div>
    </div>
  );
}

// ChatOnly: just the chat window, no prompt panel
export function ChatOnly() {
  return (
    <div className="w-full h-screen max-w-screen-lg mx-auto py-4 flex flex-col items-center px-4">
      <div className="flex items-end py-2 px-4 mb-6">
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
      <Card className="w-full h-full">
        <ChatPanel />
      </Card>
    </div>
  );
}
