"use client";
import PromptPanel from "./prompt-panel";
import ChatPanel from "./chat/chat-panel";
import ChatContainer from "./chat/chat-container";

export default function PlaygroundChat() {
  return (
    <div className="flex h-full border rounded-lg bg-background shadow">
      <div className="w-1/2 h-full">
        <PromptPanel />
      </div>
      <div className="w-1/2 h-[calc(100vh-90px)] p-4">
        <ChatPanel playground={true} />
      </div>
    </div>
  );
}

// ChatOnly: just the chat window, no prompt panel
export function ChatOnly({ onChatCreated = null, playground = false }) {
  return (
    <div className="bg-background">
      <div className="w-full h-screen flex flex-col items-center relative">
        {/* ===== HEADER ===== */}
        <div className="flex justify-center items-center gap-2 bg-background z-10 p-3 border-b border-border absolute top-0 w-full sm:bg-transparent sm:left-4 sm:justify-start sm:border-none">
          <img
            src="https://images.prismic.io/favfly2/aD00h7h8WN-LVdrA_GatherlyLogo.png?auto=format,compress"
            alt="Gatherly Logo"
            fetchPriority="high"
            className="w-auto h-7"
          />
          <h4 className="text-xl font-bold">Gatherly</h4>
        </div>

        {/* ===== CHAT CONTAINER ===== */}
        <div className="w-full h-full p-4">
          <ChatContainer
            onChatCreated={onChatCreated}
            playground={playground}
          />
        </div>
      </div>
    </div>
  );
}
