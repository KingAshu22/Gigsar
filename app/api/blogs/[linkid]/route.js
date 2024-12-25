import { NextResponse } from "next/server";
import { connectToDB } from "@/app/_utils/mongodb";
import GigsarBlog from "@/models/GigsarBlog";

// GET request handler
export async function GET(req, context) {
  const { params } = context;
  const { linkid } = await params;
  try {
    await connectToDB(); // Ensure the database is connected

    // Find the blog by slug
    const blog = await GigsarBlog.findOne({ linkid });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data" },
      { status: 500 }
    );
  }
}
