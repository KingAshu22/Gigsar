import Artist from "@/lib/models/Artist";
import { connectToDB } from "@/app/_utils/mongodb";

// Handler function for GET requests
export async function getArtists(req, res) {
  await connectToDB();
  try {
    // Fetch all artists from the database
    const artists = await Artist.find({});
    res.json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error.message);
    // Send a more specific error response based on the type of error
    res.status(500).json({ error: "Server error" });
  }
}

// Export the handler function for the GET request
export { getArtists as default };
