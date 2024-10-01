import { connectToDB } from "@/app/_utils/mongodb";
import Artist from "@/models/Artist";

export async function GET(req) {
  await connectToDB();
  try {
    // Fetch all artists from MongoDB
    const artists = await Artist.find({ showGigsar: true }).exec();

    // Extract unique filters
    const uniqueCategories = [
      "All Artist Types",
      ...new Set(artists.map((artist) => artist.artistType)),
    ];

    const allGenres = artists.flatMap((artist) => artist.genre?.split(", "));
    const uniqueGenres = [...new Set(allGenres)];

    // Calculate top 10 genres based on frequency
    const genreFrequency = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    const topGenres = Object.entries(genreFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre]) => genre);

    const uniqueLocations = [
      "All Locations",
      ...new Set(artists.map((artist) => artist.location)),
    ];

    const allEventTypes = artists.flatMap((artist) =>
      artist.eventsType?.split(", ")
    );
    const uniqueEventsTypes = ["All Event Types", ...new Set(allEventTypes)];

    // Calculate top event types based on frequency
    const eventsFrequency = allEventTypes.reduce((acc, eventsType) => {
      acc[eventsType] = (acc[eventsType] || 0) + 1;
      return acc;
    }, {});

    const topEventTypes = Object.entries(eventsFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([eventsType]) => eventsType);

    const uniqueGenders = [
      "All",
      ...new Set(artists.map((artist) => artist.gender)),
    ];

    // Return JSON response with unique filters
    return new Response(
      JSON.stringify({
        categories: uniqueCategories,
        genres: uniqueGenres,
        topGenres,
        locations: uniqueLocations,
        eventsTypes: uniqueEventsTypes,
        topEventTypes,
        genders: uniqueGenders,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching filters:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
