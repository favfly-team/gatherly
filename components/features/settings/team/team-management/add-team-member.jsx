"use client";

import { useState, useCallback, useEffect } from "react";
import Form from "@/components/layout/form-fields/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/custom/use-debounce";
import memberStore from "@/storage/member-store";
import { loadAllDataAction } from "@/components/actions/data-actions";
import createTeamMemberAction from "./actions/create-team-member-action";

const AddTeamMember = () => {
  const { workspace_id } = useParams(); // This is the slug
  const router = useRouter();

  // ======= STORES ========
  const { checkUserExists, addMemberToWorkspace } = memberStore();

  // ======= STATE ========
  const [email, setEmail] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [existingUser, setExistingUser] = useState(null);
  const [shouldShowNewUserForm, setShouldShowNewUserForm] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  // ======= LOAD WORKSPACE ========
  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const workspaces = await loadAllDataAction({
          table_name: "workspaces",
          query: {
            where: {
              slug: workspace_id,
            },
          },
        });

        if (workspaces && workspaces.length > 0) {
          setCurrentWorkspace(workspaces[0]);
        }
      } catch (error) {
        console.error("Error loading workspace:", error);
      }
    };

    if (workspace_id) {
      loadWorkspace();
    }
  }, [workspace_id]);

  // Create new user form
  const userCreationSchema = z.object({
    display_name: z.string().min(3, "Name is required"),
    password: z.string().min(8, "Password is required"),
  });

  const userCreationForm = useForm({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
      display_name: "",
      password: nanoid(10),
    },
  });

  // User creation form fields
  const userCreationFields = [
    {
      name: "display_name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      validation: z.string().min(3, "Name is required"),
    },
    {
      name: "password",
      label: "Password",
      type: "text",
      defaultValue: nanoid(10),
      placeholder: "Enter password",
      validation: z.string().min(8, "Password is required"),
    },
  ];

  // Check email when typing stops
  const checkEmailFn = useCallback(
    async (emailToCheck) => {
      if (!emailToCheck || !emailToCheck.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setExistingUser(null);
        setShouldShowNewUserForm(false);
        return;
      }

      setIsCheckingEmail(true);

      try {
        const result = await checkUserExists(emailToCheck);

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.exists) {
          setExistingUser(result.user);
          setShouldShowNewUserForm(false);
        } else {
          setExistingUser(null);
          setShouldShowNewUserForm(true);
        }
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      } finally {
        setIsCheckingEmail(false);
      }
    },
    [checkUserExists]
  );

  // Use the custom debounce hook
  const debouncedCheckEmail = useDebounce(checkEmailFn, 500);

  // Handle email change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (!newEmail) {
      setExistingUser(null);
      setShouldShowNewUserForm(false);
    } else {
      debouncedCheckEmail(newEmail);
    }
  };

  // Add existing user to workspace
  const addExistingUser = async () => {
    if (!currentWorkspace || !existingUser) {
      toast.error("Missing workspace or user information");
      return;
    }

    try {
      await addMemberToWorkspace(currentWorkspace.id, existingUser.id);
      toast.success("Team member added successfully");
      router.push(`/${workspace_id}/settings/team`);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  // Create new user and add to workspace
  const createNewUser = async (values) => {
    if (!currentWorkspace) {
      toast.error("Workspace information not available");
      return;
    }

    try {
      const data = await createTeamMemberAction({
        ...values,
        email,
        workspace_id: currentWorkspace.id,
      });

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success("Team member created and added successfully");
      router.push(`/${workspace_id}/settings/team`);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Card className="p-6">
      <div className="max-w-[400px] space-y-6">
        {/* Email input with realtime checking */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2 relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={handleEmailChange}
                className="flex-1"
              />
              {isCheckingEmail && (
                <Loader2 className="absolute right-2 h-4 w-4 animate-spin text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {/* Existing user card */}
        {existingUser && (
          <div className="space-y-4">
            <InfoCard
              title={existingUser.display_name}
              description={existingUser.email}
              icon={<User />}
            />

            <Button onClick={addExistingUser} className="w-full">
              Add Member
            </Button>
          </div>
        )}

        {/* New user form */}
        {shouldShowNewUserForm && (
          <div className="space-y-4">
            <Form
              form={userCreationForm}
              onSubmit={createNewUser}
              fields={userCreationFields}
              className="grid grid-cols-2 gap-6 space-y-0"
              submitLabel="Add Member"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

const InfoCard = ({ title, description, icon }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border-gray-200">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMember;
