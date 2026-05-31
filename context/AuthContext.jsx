"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//Create the context 
const AuthContext = createContext(null);

//Create the Provider component

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //Check who is logged in when the app loads
  // This runs once when the app first mounts
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      // Whether it succeeded or failed, we are done loading
      setLoading(false);
    }
  }

  //Login function
  // Components call this after a successful login API response
  async function login(email, password) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Fetch the full user data from /api/auth/me
        // so we have everything including wallet, wishlist etc.
        await checkAuth();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  }

  //Register function
  async function register(name, email, password) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        await checkAuth();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  }

  //Logout function
  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  //The value we share with every component─
  const value = {
    user,        // the current user object (or null if not logged in)
    loading,     // true while we're checking auth on first load
    login,       // function to log in
    register,    // function to register
    logout,      // function to log out
    checkAuth,   // function to refresh user data
    isLoggedIn: !!user,              // quick boolean — is anyone logged in?
    isCustomer: user?.role === "customer",
    isVendor: user?.role === "vendor",
    isAdmin: user?.role === "admin",
  };

  //While checking auth, show nothing
  // This prevents a flash where the navbar briefly shows "login"
  // even for a logged-in user, before the check completes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

//Custom hook
// Instead of writing useContext(AuthContext) everywhere,
// components just write useAuth()  clean and simple
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}