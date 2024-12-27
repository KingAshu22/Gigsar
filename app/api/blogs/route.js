import { NextResponse } from "next/server";
import { connectToDB } from "@/app/_utils/mongodb";
import GigsarBlog from "@/models/GigsarBlog";

// Ensure the database connection is established
await connectToDB();

// GET: Fetch all blogs
export async function GET() {
  try {
    // Fetch all blogs from the database
    const blogs = await GigsarBlog.find();

    // Return the blogs
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
