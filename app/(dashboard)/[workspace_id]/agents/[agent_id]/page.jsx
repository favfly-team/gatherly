import Layout from "@/components/layout/layout/v3";
import { TabsContent } from "@/components/ui/tabs";
import Flows from "@/components/features/flows";
import PlaygroundChat from "@/components/features/playground";

const AgentPage = () => {
  return (
    <Layout>
      <TabsContent value="flows" className="h-full">
        <Flows />
      </TabsContent>
      <TabsContent value="playground" className="h-full">
        <PlaygroundChat />
      </TabsContent>
    </Layout>
  );
};

export default AgentPage;
