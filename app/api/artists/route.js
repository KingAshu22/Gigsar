import Artist from "@/models/Artist";
import { connectToDB } from "@/app/_utils/mongodb";

export async function GET(req) {
  await connectToDB();
  try {
    // Fetch all artists from the database
    const artists = await Artist.find({});
    // Return a successful response with the artists data
    return new Response(JSON.stringify(artists), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching artists:", error.message);
    // Return a server error response
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const dynamic = "force-dynamic";
