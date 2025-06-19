"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/firebase-client";
import SyncLoading from "@/components/layout/loading/sync-loading";
import userStore from "@/storage/user-store";
import workspaceStore from "@/storage/workspace-store";

export default function AuthGuard({ children }) {
  // ===== USE STATE =====
  const [loading, setLoading] = useState(true);

  // ===== USE ROUTER =====
  const router = useRouter();

  // ===== USE PATHNAME =====
  const pathname = usePathname();

  // ===== USE STORES =====
  const { loadUserProfile, clearUser, checkUserExists, createUserProfile } =
    userStore();
  const { loadWorkspaces } = workspaceStore();

  // ===== PATHS =====
  const paths = ["/login", "/register", "/"];

  const publicPaths = ["/api", "/chat"];

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // User is not authenticated
        clearUser();

        if (
          paths.includes(pathname) ||
          publicPaths.some((path) => pathname.startsWith(path))
        ) {
          setLoading(false);
          return;
        }

        router.replace("/login");
      } else {
        // User is authenticated
        try {
          // Check if user profile exists in Firestore
          const userExists = await checkUserExists(firebaseUser.uid);

          if (!userExists) {
            // Create user profile if it doesn't exist
            await createUserProfile(firebaseUser.uid, {
              display_name: firebaseUser.displayName || "",
              email: firebaseUser.email || "",
              profile_image: firebaseUser.photoURL || "",
            });
          } else {
            // Load existing user profile
            await loadUserProfile(firebaseUser.uid);
          }

          if (paths.includes(pathname)) {
            // Load user's workspaces and redirect to first workspace
            await loadWorkspaces(firebaseUser.uid);

            // Get workspaces from store after loading
            const { workspaces } = workspaceStore.getState();

            if (workspaces && workspaces.length > 0) {
              router.replace(`/${workspaces[0].slug}/agents`);
              return;
            }

            return;
          }

          setLoading(false);
        } catch (error) {
          console.error("Error in auth guard:", error);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [
    pathname,
    loadUserProfile,
    clearUser,
    checkUserExists,
    createUserProfile,
    loadWorkspaces,
  ]);

  if (loading) {
    return <SyncLoading className="h-screen" />;
  }

  return children;
}
