"use client";
import Table from "@/components/layout/table";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, MoreVertical, Trash2, UserRound } from "lucide-react";
import DropdownMenu from "@/components/layout/dropdown-menu";
import { useParams } from "next/navigation";
import TableSkeleton from "@/components/layout/table/table-skeleton";
import { useState, useEffect } from "react";
import AlertModal from "@/components/layout/modal/alert-modal";
import memberStore from "@/storage/member-store";
import userStore from "@/storage/user-store";
import { loadAllDataAction } from "@/components/actions/data-actions";

const TeamManagement = () => {
  // ======= INITIALIZE PARAMS ========
  const { workspace_id } = useParams(); // This is the slug

  // ======= INITIALIZE STORES ========
  const {
    members,
    isLoading,
    loadWorkspaceMembers,
    updateMember: updateMemberStore,
  } = memberStore();
  const { user: currentUser } = userStore();

  // ======= INITIALIZE STATES ========
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentMemberInfo, setCurrentMemberInfo] = useState(null);

  // ======= LOAD DATA ========
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get workspace by slug to get the workspace ID
        const workspaces = await loadAllDataAction({
          table_name: "workspaces",
          query: {
            where: {
              slug: workspace_id,
            },
          },
        });

        if (workspaces && workspaces.length > 0) {
          // Load workspace members using the workspace ID
          await loadWorkspaceMembers(workspaces[0].id);
        }
      } catch (error) {
        console.error("Error loading workspace data:", error);
      }
    };

    if (workspace_id) {
      loadData();
    }
  }, [workspace_id, loadWorkspaceMembers]);

  // ======= GET CURRENT USER MEMBER INFO ========
  useEffect(() => {
    if (members && currentUser) {
      const userMember = members.find(
        (member) => member.user_id === currentUser.id
      );
      setCurrentMemberInfo(userMember);
    }
  }, [members, currentUser]);

  // ======= TABLE COLUMNS ========
  const columns = [
    {
      accessorKey: "user.display_name",
      header: <div className="px-4">Name</div>,
      cell: ({ row }) => (
        <div className="px-4 py-1 flex flex-col gap-1">
          {row.original.user.display_name || "Unknown"}
        </div>
      ),
    },
    {
      accessorKey: "user.email",
      header: <div className="px-4">Email</div>,
      cell: ({ row }) => (
        <div className="px-4 py-1 flex flex-col gap-1">
          {row.original.user.email || "Unknown"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: <div className="px-4 py-1">Status</div>,
      cell: ({ row }) => (
        <div className="px-4 capitalize">
          <Badge variant="outline">{row.getValue("status")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: <div className="px-4 py-1">Role</div>,
      cell: ({ row }) => (
        <div className="px-4 capitalize">
          <Badge variant="outline">{row.getValue("role")}</Badge>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const items = [
          {
            icon: <UserRound />,
            disabled:
              row.original.role === "owner" ||
              currentMemberInfo?.role === "member",
            label: "Transfer Ownership",
            onClick: () => {
              setSelectedMember(row.original);
              setIsTransferOpen(true);
            },
          },
          {
            icon:
              row.original.status == "active" ? <Trash2 /> : <CircleCheck />,
            disabled:
              row.original.role === "owner" ||
              currentMemberInfo?.role === "member",
            label:
              row.original.status == "active"
                ? "Deactivate Account"
                : "Reactivate Account",
            onClick: () => {
              setSelectedMember(row.original);
              setIsStatusOpen(true);
            },
          },
        ];

        return <DropdownMenu items={items} trigger={<MoreVertical />} />;
      },
    },
  ];

  return (
    <>
      <div>
        {isLoading ? (
          <TableSkeleton rows={5} columns={columns.length} />
        ) : (
          <Table data={members} columns={columns} />
        )}
      </div>

      {/* // ===== DEACTIVATE ACCOUNT MODAL ===== */}
      <AlertModal
        isOpen={isStatusOpen}
        setIsOpen={setIsStatusOpen}
        title={`${
          selectedMember?.status === "active" ? "Deactivate" : "Reactivate"
        } Account`}
        description={`Are you sure you want to ${
          selectedMember?.status === "active" ? "deactivate" : "reactivate"
        } this member's account?`}
        confirmLabel={
          selectedMember?.status === "active" ? "Deactivate" : "Reactivate"
        }
        cancelLabel="Cancel"
        onConfirm={async () => {
          if (selectedMember) {
            const newStatus =
              selectedMember.status === "active" ? "deactivated" : "active";

            try {
              await updateMemberStore(selectedMember.id, {
                status: newStatus,
              });
            } catch (error) {
              console.error("Error updating member status:", error);
            }
          }

          setIsStatusOpen(false);
          setSelectedMember(null);
        }}
        onCancel={() => {
          setIsStatusOpen(false);
          setSelectedMember(null);
        }}
      />

      {/* // ===== TRANSFER OWNERSHIP MODAL ===== */}
      <AlertModal
        isOpen={isTransferOpen}
        setIsOpen={setIsTransferOpen}
        title="Transfer Ownership"
        description="Are you sure you want to transfer ownership of this workspace?"
        confirmLabel="Transfer"
        cancelLabel="Cancel"
        onConfirm={async () => {
          if (selectedMember && currentMemberInfo) {
            const currentOwner = members.find((item) => item.role === "owner");

            try {
              // Update selected member to owner
              await updateMemberStore(selectedMember.id, {
                role: "owner",
              });

              // Update current owner to member
              if (currentOwner) {
                await updateMemberStore(currentOwner.id, {
                  role: "member",
                });
              }
            } catch (error) {
              console.error("Error transferring ownership:", error);
            }
          }

          setIsTransferOpen(false);
          setSelectedMember(null);
        }}
        onCancel={() => {
          setIsTransferOpen(false);
          setSelectedMember(null);
        }}
      />
    </>
  );
};

export default TeamManagement;
