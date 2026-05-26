import { cookies } from "next/headers";

export async function POST() {
  try {
    // Delete the token cookie by setting it to an empty value
    // with an expiry date in the past
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // maxAge of 0 tells the browser to delete it immediately
      path: "/",
    });

    return Response.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}