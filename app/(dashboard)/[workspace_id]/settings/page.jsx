import { redirect } from "next/navigation";

const SettingsPage = ({ params }) => {
  const { workspace_id } = params;

  redirect(`/${workspace_id}/settings/workspace`);
};

export default SettingsPage;
