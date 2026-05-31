import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ─────────────────────────────────────────
// GET CURRENT USER FROM COOKIE
// ─────────────────────────────────────────

// Reads the token cookie, verifies it, and returns the decoded user payload
// Returns null if no token exists or if the token is invalid
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token.value);
    return decoded; // { id, role, iat, exp }
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}


// REQUIRE AUTHENTICATION


// Use this at the top of any API route that requires a logged-in user
// Returns the user if authenticated, or a 401 response if not
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: Response.json(
        { success: false, message: "You must be logged in to do this" },
        { status: 401 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}


// REQUIRE VENDOR ROLE


// Use this at the top of any API route that requires a vendor or admin
export async function requireVendor() {
  const { error, user } = await requireAuth();

  if (error) return { error, user: null };

  if (user.role !== "vendor" && user.role !== "admin") {
    return {
      error: Response.json(
        {
          success: false,
          message: "You do not have permission to do this",
        },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}


// REQUIRE ADMIN ROLE


// Use this at the top of any API route that requires an admin
export async function requireAdmin() {
  const { error, user } = await requireAuth();

  if (error) return { error, user: null };

  if (user.role !== "admin") {
    return {
      error: Response.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}