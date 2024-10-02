import { connectToDB } from "@/app/_utils/mongodb";
import Artist from "@/models/Artist";

const parsePrice = (priceString) => {
  return parseInt(priceString.replace(/,/g, ""), 10);
};

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
      selectedSortOption: url.searchParams.get("sortOption") || "Low to High",
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

    // Adding aggregation to handle price stored as string
    const aggregationPipeline = [
      { $match: query }, // Apply filters before aggregation
      {
        $addFields: {
          numericPrice: {
            $toInt: {
              $replaceAll: { input: "$price", find: ",", replacement: "" },
            },
          },
        },
      },
      // Filtering by min and max budget if provided
      ...(isNaN(minBudget)
        ? []
        : [{ $match: { numericPrice: { $gte: minBudget } } }]),
      ...(isNaN(maxBudget)
        ? []
        : [{ $match: { numericPrice: { $lte: maxBudget } } }]),
      // Sorting by price (numericPrice field)
      {
        $sort: {
          numericPrice: filters.selectedSortOption === "Low to High" ? 1 : -1,
        },
      },
      // Pagination
      { $skip: (filters.page - 1) * 12 },
      { $limit: 12 },
      // Selecting only required fields
      {
        $project: {
          linkid: 1,
          profilePic: 1,
          name: 1,
          price: 1,
          location: 1,
          artistType: 1,
        },
      },
    ];

    // Fetching artists and total count
    const [artists, totalArtists] = await Promise.all([
      Artist.aggregate(aggregationPipeline).exec(),
      Artist.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalArtists / 12);

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

export const dynamic = "force-dynamic";
