import Artist from "@/models/Artist";
import { connectToDB } from "@/app/_utils/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url); // Extract search params from the request URL
  console.log("Inside Route");
  const date = searchParams.get("date");
  const location = searchParams.get("location");
  console.log(location);

  console.log(date);

  // Convert the date from DD/MM/YYYY to YYYY-MM-DD
  const [day, month, year] = date.split("/");
  const normalizedDate = `${year}-${month}-${day}`;

  await connectToDB(); // Connect to the database

  try {
    // Find artists that are featured, whose showGigsar is true, and where the busyDates do not include the given date (normalized to YYYY-MM-DD)
    const artists = await Artist.find({
      feature: "Featured House Party Artists",
      showGigsar: "live",
      location: {
        $regex: new RegExp(location, "i"), // Case-insensitive search
      },
      busyDates: {
        $ne: normalizedDate, // Ensure the busyDates array does not include the selected date
      },
    }).or([
      { location: { $regex: new RegExp(location.split(" ")[0], "i") } }, // First word of the location
      { location: { $regex: new RegExp(location, "i") } }, // Full location match
    ]);

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
