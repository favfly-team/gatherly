import Layout from "@/components/layout/layout/v3";
import { TabsContent } from "@/components/ui/tabs";
import Flows from "@/components/features/flows";

const AgentPage = () => {
  return (
    <Layout>
      <TabsContent value="flows" className="h-full">
        <Flows />
      </TabsContent>
      <TabsContent value="playground">
        <div>Playground</div>
      </TabsContent>
    </Layout>
  );
};

export default AgentPage;
