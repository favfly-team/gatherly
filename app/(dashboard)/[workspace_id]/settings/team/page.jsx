import PageLayout from "@/components/layout/page-layout/v2";
import TeamMain from "@/components/features/settings/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const TeamPage = () => {
  const button = (
    <Button asChild>
      <Link href="team/add">
        <Plus />
        Add Team Member
      </Link>
    </Button>
  );

  return (
    <PageLayout title="Manage Team" button={button}>
      <TeamMain />
    </PageLayout>
  );
};

export default TeamPage;
