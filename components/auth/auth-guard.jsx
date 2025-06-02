"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/firebase-client";
import SyncLoading from "@/components/layout/loading/sync-loading";
import { loadAllDataAction } from "@/components/actions/data-actions";

export default function AuthGuard({ children }) {
  // ===== USE STATE =====
  const [loading, setLoading] = useState(true);

  // ===== USE ROUTER =====
  const router = useRouter();

  // ===== USE PATHNAME =====
  const pathname = usePathname();

  // ===== PATHS =====
  const paths = ["/login", "/register", "/"];

  const publicPaths = ["/api", "/chat"];

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (
          paths.includes(pathname) ||
          publicPaths.some((path) => pathname.startsWith(path))
        ) {
          setLoading(false);
          return;
        }

        router.replace("/login");
      } else {
        if (paths.includes(pathname)) {
          // GET USER INFO AND REDIRECT TO WORKSPACE
          const workspaces = await loadAllDataAction({
            table_name: "workspaces",
            query: {
              where: {
                workspace_members: [user.uid],
              },
            },
          });

          router.replace(`/${workspaces[0].slug}/agents`);
          return;
        }

        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  if (loading) {
    return <SyncLoading className="h-screen" />;
  }

  return children;
}
