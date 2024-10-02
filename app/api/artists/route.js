import { connectToDB } from "@/app/_utils/mongodb";
import Artist from "@/models/Artist";

export async function GET(req) {
  await connectToDB();
  try {
    // Extracting query parameters from URL
    const url = new URL(req.url);

    const filters = {
      selectedCategory: url.searchParams.get("category") || "All Artist Types",
      selectedGenre: url.searchParams.get("genre")
        ? url.searchParams.get("genre").split(",")
        : [],
      selectedLocation: url.searchParams.get("location") || "All Locations",
      selectedEventType: url.searchParams.get("eventType") || "All Event Types",
      selectedGender: url.searchParams.get("gender") || "All",
      selectedMinBudget: url.searchParams.get("minBudget") || "",
      selectedMaxBudget: url.searchParams.get("maxBudget") || "",
      searchQuery: url.searchParams.get("searchQuery") || "",
      selectedDate: url.searchParams.get("selectedDate") || "",
      selectedSortOption:
        url.searchParams.get("selectedSortOption") || "Low to High",
      page: parseInt(url.searchParams.get("page"), 10) || 1,
    };

    console.log(filters);

    // Build MongoDB query based on filters
    const query = { showGigsar: true };

    // Only add filters if they are not set to their default values
    if (filters.selectedCategory !== "All Artist Types") {
      query.artistType = filters.selectedCategory;
    }

    // Check if any genre is selected
    query.genre = {
      $regex: filters.selectedGenre.map((genre) => genre.trim()).join("|"),
      $options: "i",
    };

    if (filters.selectedLocation !== "All Locations") {
      query.location = filters.selectedLocation;
    }

    if (filters.selectedEventType !== "All Event Types") {
      query.eventsType = {
        $regex: new RegExp(filters.selectedEventType, "i"),
      };
    }

    if (filters.selectedGender !== "All") {
      query.gender = filters.selectedGender;
    }

    // Use price for min and max filtering
    const minBudget = parseInt(filters.selectedMinBudget.replace(/,/g, ""), 10);
    const maxBudget = parseInt(filters.selectedMaxBudget.replace(/,/g, ""), 10);

    // Only add price filters if min and max budgets are valid numbers
    if (!isNaN(minBudget)) {
      query.price = { ...query.price, $gte: minBudget };
    }

    if (!isNaN(maxBudget)) {
      query.price = { ...query.price, $lte: maxBudget };
    }

    if (filters.searchQuery) {
      query.name = { $regex: filters.searchQuery, $options: "i" };
    }

    if (filters.selectedDate) {
      query.busyDates = {
        $nin: [new Date(filters.selectedDate).toISOString()],
      };
    }

    // Sort by price
    const sortOption =
      filters.selectedSortOption === "Low to High"
        ? { price: 1 }
        : { price: -1 };

    // Pagination
    const pageSize = 12;
    const skip = (filters.page - 1) * pageSize;

    console.log(query); // For debugging

    // Fetch artists from MongoDB with filtering, sorting, and pagination
    const [artists, totalArtists] = await Promise.all([
      Artist.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .select("linkid profilePic name price location artistType") // Select only required fields
        .exec(),
      Artist.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalArtists / pageSize);

    // Return JSON response
    return new Response(
      JSON.stringify({
        artists,
        totalPages,
        totalArtists,
        page: filters.page,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching artists:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
