import AgentLayout from "@/components/layout/layout/v3";
import { TabsContent } from "@/components/ui/tabs";
import Chats from "@/components/features/chats";
import PlaygroundChat from "@/components/features/playground";
import ShareAgent from "@/components/features/agents/share/index";

const AgentPage = () => {
  return (
    <AgentLayout>
      <TabsContent value="chats" className="h-full">
        <Chats />
      </TabsContent>
      <TabsContent value="playground" className="h-full">
        <PlaygroundChat />
      </TabsContent>
      <TabsContent value="share" className="h-full">
        <ShareAgent />
      </TabsContent>
    </AgentLayout>
  );
};

export default AgentPage;
