import { auth } from "@/firebase/firebase-client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { createDataAction } from "@/components/actions/data-actions";
import { errorHandler } from "@/hooks/error";
import { slugify } from "@/hooks/custom/use-formatters";

const createUserAction = async (data) => {
  try {
    // ====== DESTRUCTURE VARIABLES ======
    const { name, company_name, email, password } = data;

    // ====== CREATE FIREBASE USER ======
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // ====== UPDATE USER PROFILE ======
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // ====== CREATE USER DOCUMENT ======
    const newUser = await createDataAction({
      table_name: "users",
      id: userCredential.user.uid,
      query: {
        data: {
          display_name: name,
          email: email,
          profile_image: "",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      },
    });

    // ====== CREATE WORKSPACE ======
    const workspaceSlug = slugify(company_name);
    const workspace = await createDataAction({
      table_name: "workspaces",
      query: {
        data: {
          name: company_name,
          slug: workspaceSlug,
          created_at: Date.now(),
          updated_at: Date.now(),
          workspace_members: [userCredential.user.uid],
        },
      },
    });

    // ====== CREATE WORKSPACE MEMBER ======
    await createDataAction({
      table_name: "workspace_members",
      query: {
        data: {
          workspace_id: workspace.id,
          user_id: userCredential.user.uid,
          role: "owner",
          status: "active",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      },
    });

    return {
      user: userCredential.user,
      ...newUser,
      workspace,
    };
  } catch (error) {
    console.error("Error in createUserAction:", error.message);
    return errorHandler(error);
  }
};

export default createUserAction;
