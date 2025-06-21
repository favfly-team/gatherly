import AgentLayout from "@/components/layout/layout/v3";
import { TabsContent } from "@/components/ui/tabs";
import Chats from "@/components/features/chats";
import PlaygroundChat from "@/components/features/playground";

const AgentPage = () => {
  return (
    <AgentLayout>
      <TabsContent value="chats" className="h-full">
        <Chats />
      </TabsContent>
      <TabsContent value="playground" className="h-full">
        <PlaygroundChat />
      </TabsContent>
    </AgentLayout>
  );
};

export default AgentPage;
