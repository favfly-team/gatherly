"use client";
import PromptPanel from "./prompt-panel";
import ChatPanel from "./chat-panel";
import { Card } from "@/components/ui/card";

export default function PlaygroundChat() {
  return (
    <div className="grid grid-cols-12 h-full border rounded-lg bg-background shadow overflow-hidden">
      <div className="col-span-6">
        <PromptPanel />
      </div>
      <div className="col-span-6">
        <ChatPanel />
      </div>
    </div>
  );
}

// ChatOnly: just the chat window, no prompt panel
export function ChatOnly() {
  return (
    <div className="w-full h-screen max-w-screen-lg mx-auto py-4 flex flex-col items-center px-4">
      <img
        src="https://images.prismic.io/favfly2/Z44AIJbqstJ99n2k_FINALLOGOFILE-01-01.png?auto=format,compress"
        alt=""
        loading="lazy"
        className="w-auto h-10 mx-auto mb-4"
      />
      <Card className="w-full h-full">
        <ChatPanel />
      </Card>
    </div>
  );
}
