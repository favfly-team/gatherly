import { redirect } from "next/navigation";

const DashboardPage = ({ params }) => {
  redirect(`/${params.workspace_id}/agents`);
};

export default DashboardPage;
