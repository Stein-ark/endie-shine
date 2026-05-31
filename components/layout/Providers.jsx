"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";

export default function Providers({ children }) {
  const pathname = usePathname();

  // Hide navbar on auth pages
  const hideNavbar = ["/login", "/register"].some((path) =>
    pathname.startsWith(path)
  );

  return (
    <SessionProvider>
      <AuthProvider>
        {!hideNavbar && <Navbar />}
        <main style={{ paddingTop: hideNavbar ? "0" : "68px" }}>
          {children}
        </main>
      </AuthProvider>
    </SessionProvider>
  );
}