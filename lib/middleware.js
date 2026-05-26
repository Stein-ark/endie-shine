import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token.value);
    return decoded;
  } catch (error) {
    return null;
  }
}

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

export async function requireVendor() {
  const { error, user } = await requireAuth();

  if (error) return { error, user: null };

  if (user.role !== "vendor" && user.role !== "admin") {
    return {
      error: Response.json(
        { success: false, message: "You do not have permission to do this" },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}

export async function requireAdmin() {
  const { error, user } = await requireAuth();

  if (error) return { error, user: null };

  if (user.role !== "admin") {
    return {
      error: Response.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}