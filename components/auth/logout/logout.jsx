"use client";

import { createClient } from "@/utils/supabase/client";

const LogoutButton = ({ children }) => {
  // ===== CREATE SUPABASE CLIENT =====
  const supabase = createClient();

  // ===== HANDLE LOGOUT =====
  const handleLogout = async () => {
    await supabase.auth.signOut();

    location.reload();
  };

  return (
    <div onClick={handleLogout} asChild>
      {children}
    </div>
  );
};

export default LogoutButton;
