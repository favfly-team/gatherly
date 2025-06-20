"use client";
import { useParams } from "next/navigation";
import InitialMessageSettings from "./initial-message-settings";

export default function AgentSettings() {
  // ===== GET AGENT ID =====
  const { agent_id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Agent Settings</h2>
        <p className="text-muted-foreground">
          Configure your agent's behavior and default responses
        </p>
      </div>

      {/* Initial Message Settings */}
      <InitialMessageSettings agent_id={agent_id} />
    </div>
  );
}
