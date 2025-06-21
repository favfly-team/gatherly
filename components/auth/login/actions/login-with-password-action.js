import { auth } from "@/firebase/firebase-client";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  findUniqueDataAction,
  loadAllDataAction,
} from "@/components/actions/data-actions";
import { handleFirebaseError } from "@/utils/firebase-errors";

const loginWithPasswordAction = async (values) => {
  try {
    // ====== SIGN IN WITH PASSWORD ======
    const userCredential = await signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    // ====== ERROR HANDLING ======
    if (!userCredential.user) {
      throw new Error("Authentication failed");
    }

    // ====== FIND USER ======
    const user = await findUniqueDataAction({
      table_name: "users",
      query: {
        where: {
          id: userCredential.user.uid,
        },
      },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // ====== GET USER'S ACTIVE WORKSPACES ======
    const workspaces = await loadAllDataAction({
      table_name: "workspaces",
      query: {
        where: {
          workspace_members: [userCredential.user.uid],
        },
      },
    });

    // ====== RETURN USER DATA WITH WORKSPACES ======
    return {
      ...user,
      workspaces,
    };
  } catch (error) {
    console.error("Login error:", error.message);
    return handleFirebaseError(error);
  }
};

export default loginWithPasswordAction;
