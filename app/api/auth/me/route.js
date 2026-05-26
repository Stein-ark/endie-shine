import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/middleware";

export async function GET() {
  try {
    //Get the current user from the cookie 
    const currentUser = await getCurrentUser();

    //If no valid token, return null ─
    if (!currentUser) {
      return Response.json(
        { success: false, message: "Not authenticated", user: null },
        { status: 401 }
      );
    }

    //Connect to DB and fetch fresh user data 
    await connectDB();

   
    const user = await User.findById(currentUser.id).select(
      "-password -__v"
    );

    //If user no longer exists in DB ─
    if (!user) {
      return Response.json(
        { success: false, message: "User not found", user: null },
        { status: 404 }
      );
    }

    //If account has been deactivated 
    if (!user.isActive) {
      return Response.json(
        { success: false, message: "Account deactivated", user: null },
        { status: 403 }
      );
    }

    //Return the fresh user data
    return Response.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return Response.json(
      { success: false, message: "Something went wrong", user: null },
      { status: 500 }
    );
  }
}