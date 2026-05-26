import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken, cookieOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
  
    await connectDB();

    // Read the data sent from the frontend
    const body = await request.json();
    const { name, email, password } = body;

    //  Validate that all fields are present 
    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    //  Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    //  Validate password length 
    if (password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    //  Hash the password 
    const hashed = await hashPassword(password);

    // Save the new user to the database 
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "customer",
    });

    // Create a JWT with the user's ID and role 
    const token = signToken({ id: user._id, role: user.role });

    //Store the JWT in an HTTP-only cookie 
    const cookieStore = await cookies();
    cookieStore.set("token", token, cookieOptions);

    // Return success — never send the password back
    return Response.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}