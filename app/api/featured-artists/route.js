import Artist from "@/models/Artist";
import { connectToDB } from "@/app/_utils/mongodb";

// Helper function to get only the YYYY-MM-DD part of a date in ISO format
function getISODateOnly(date) {
  return new Date(date).toISOString().split("T")[0]; // Extract only the date part (YYYY-MM-DD)
}

export async function GET(req) {
  const { searchParams } = new URL(req.url); // Extract search params from the request URL
  const date = searchParams.get("date");
  const location = searchParams.get("location");

  const selectedDate = getISODateOnly(new Date(date)); // Normalize the selected date to YYYY-MM-DD
  console.log(selectedDate);

  await connectToDB(); // Connect to the database

  try {
    // Find artists that are featured, whose showGigsar is true, and where the busyDates do not include the given date (normalized to YYYY-MM-DD)
    const artists = await Artist.find({
      feature: "Featured House Party Artists",
      showGigsar: true,
      busyDates: {
        $nin: [new Date(date).toISOString()],
      },
      location: {
        $regex: new RegExp(location, "i"), // Case-insensitive search
      },
    });

    if (artists.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No featured artists available for this date.",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return a successful response with the list of artists
    return new Response(JSON.stringify(artists), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching featured artists:", error.message);

    // Return a server error response
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
