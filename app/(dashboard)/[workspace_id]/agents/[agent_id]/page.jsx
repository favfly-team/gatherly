import AgentLayout from "@/components/layout/layout/v3";
import { TabsContent } from "@/components/ui/tabs";
import Flows from "@/components/features/flows";
import PlaygroundChat from "@/components/features/playground";

const AgentPage = () => {
  return (
    <AgentLayout>
      <TabsContent value="flows" className="h-full">
        <Flows />
      </TabsContent>
      <TabsContent value="playground" className="h-full">
        <PlaygroundChat />
      </TabsContent>
    </AgentLayout>
  );
};

export default AgentPage;
