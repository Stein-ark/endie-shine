import connectDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword, signToken, cookieOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    //Connect to the database 
    await connectDB();

    //Read the data sent from the frontend 
    const body = await request.json();
    const { email, password } = body;

    //Validate that all fields are present 
    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    //Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    //If no user found, return a vague error 
   
    if (!user) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    //Check if the account is active
    if (!user.isActive) {
      return Response.json(
        {
          success: false,
          message: "Your account has been deactivated. Please contact support.",
        },
        { status: 403 }
      );
    }

    //Compare the submitted password with the hash
    const isMatch = await comparePassword(password, user.password);

    //If passwords don't match, return a vague error 
    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    //Create a JWT with the user's ID and role 
    const token = signToken({ id: user._id, role: user.role });

    // Store the JWT in an HTTP-only cookie 
    const cookieStore = await cookies();
    cookieStore.set("token", token, cookieOptions);

    // Return success 
    return Response.json(
      {
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}