// ===== IMPORT TOASTER PROVIDER =====
import { Toaster } from "@/components/ui/sonner";

// ===== IMPORT CSS STYLES =====
import "@/styles/globals.css";
// import "@/styles/styles.css";

// ===== IMPORT FONTS =====
import { Inter } from "next/font/google";

// ===== INITIALIZE FONTS =====
const inter = Inter({
  subsets: ["latin"],
  weights: [400, 500, 600, 700],
});

// ===== IMPORT AUTH GUARD =====
import AuthGuard from "@/components/auth/auth-guard";

// ===== GLOBAL METADATA =====
export const metadata = {
  title: "Gatherly",
  description: "Gatherly is a platform for managing leads.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-accent overflow-hidden`}
      >
        <AuthGuard>{children}</AuthGuard>

        {/* ======= TOASTER PROVIDER ======= */}
        <Toaster richColors />
      </body>
    </html>
  );
}
