"use client";
import ChatContainer from "./chat-container";

export default function NewChat({ agent_id }) {
  // ===== RENDER NEW CHAT INTERFACE =====
  return (
    <div className="bg-background">
      <div className="w-full h-screen flex flex-col items-center relative">
        {/* Header */}
        <div className="flex justify-center items-center gap-2 bg-background z-10 p-3 border-b border-border absolute top-0 w-full sm:bg-transparent sm:left-4 sm:justify-start sm:border-none">
          <img
            src="https://images.prismic.io/favfly2/aD00h7h8WN-LVdrA_GatherlyLogo.png?auto=format,compress"
            alt="Gatherly Logo"
            fetchPriority="high"
            className="w-auto h-7"
          />
          <h4 className="text-xl font-bold">Gatherly</h4>
        </div>

        {/* Chat Container */}
        <div className="w-full h-full p-4">
          <ChatContainer
            mode="new"
            agent_id={agent_id}
            onFlowCreated={(flow_id) => {
              // ===== SEAMLESS URL TRANSITION =====
              const newUrl = `/chat/${flow_id}`;
              window.history.replaceState(null, "", newUrl);
            }}
          />
        </div>
      </div>
    </div>
  );
}
