import Artist from "@/models/Artist";
import { connectToDB } from "@/app/_utils/mongodb";

export async function GET(req) {
  await connectToDB(); // Connect to the database

  try {
    // Find the artist by linkid
    const artist = await Artist.find({});

    if (!artist) {
      return new Response(JSON.stringify({ error: "Artist not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return a successful response with the artist data
    return new Response(JSON.stringify(artist), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching artist:", error.message);

    // Return a server error response
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
