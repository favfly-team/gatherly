import NewChat from "@/components/features/playground/chat/new-chat";

const ChatPage = ({ searchParams }) => {
  const { agent_id } = searchParams;

  return <NewChat agent_id={agent_id} />;
};

export default ChatPage;
