import Layout from "@/components/layout/layout/v3";
import { TabsContent } from "@/components/ui/tabs";
import Flows from "@/components/features/flows";
import PlaygroundChat from "@/components/features/playground";
import AgentSettings from "@/components/features/agents/settings";

const AgentPage = () => {
  return (
    <Layout>
      <TabsContent value="flows" className="h-full">
        <Flows />
      </TabsContent>
      <TabsContent value="playground" className="h-full">
        <PlaygroundChat />
      </TabsContent>
      <TabsContent value="settings" className="h-full">
        <AgentSettings />
      </TabsContent>
    </Layout>
  );
};

export default AgentPage;
