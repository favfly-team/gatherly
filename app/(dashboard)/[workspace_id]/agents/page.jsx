import LayoutComponent from "@/components/layout/layout/v2";
import Agents from "@/components/features/agents";
import CreateAgentModal from "@/components/features/agents/create-agent-modal";

const AgentsPage = () => {
  return (
    <LayoutComponent title="Agents" button={<CreateAgentModal />}>
      <Agents />
    </LayoutComponent>
  );
};

export default AgentsPage;
