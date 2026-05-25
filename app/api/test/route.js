import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return Response.json({
      success: true,
      message: "Database connected successfully ",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Database connection failed ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}