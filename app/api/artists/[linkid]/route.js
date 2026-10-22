import Artist from "@/models/Artist";
import { connectToDB } from "@/app/_utils/mongodb";
import { toPublicArtist } from "@/lib/contactVisibility";

export async function GET(req, { params }) {
  const { linkid } = params; // Get the linkid from params

  await connectToDB(); // Connect to the database

  try {
    // Find the artist by linkid
    const artist = await Artist.findOne({ linkid });

    if (!artist) {
      return new Response(JSON.stringify({ error: "Artist not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return a successful response with the artist data, minus any contact
    // details the artist has chosen to keep private
    return new Response(JSON.stringify(toPublicArtist(artist)), {
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
