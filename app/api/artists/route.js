import Artist from "@/models/Artist";
import { connectToDB } from "@/app/_utils/mongodb";

const parsePrice = (priceString) => {
  return parseInt(priceString.replace(/,/g, ""), 10);
};

// Artist filtering and sorting logic
const filterAndSortArtists = (artists, filters) => {
  let filteredArtists = artists;

  // Category filter
  if (filters.selectedCategory !== "All Artist Types") {
    filteredArtists = filteredArtists.filter(
      (artist) => artist.artistType === filters.selectedCategory
    );
  }

  // Genre filter
  if (filters.selectedGenre.length > 0) {
    filteredArtists = filteredArtists.filter((artist) =>
      filters.selectedGenre.every((genre) =>
        artist.genre?.split(", ").includes(genre)
      )
    );
  }

  // Location filter
  if (filters.selectedLocation !== "All Locations") {
    filteredArtists = filteredArtists.filter(
      (artist) => artist.location === filters.selectedLocation
    );
  }

  // Event Type filter
  if (filters.selectedEventType !== "All Event Types") {
    filteredArtists = filteredArtists.filter((artist) =>
      artist.eventsType?.split(", ").includes(filters.selectedEventType)
    );
  }

  // Gender filter
  if (filters.selectedGender !== "All") {
    filteredArtists = filteredArtists.filter(
      (artist) => artist.gender === filters.selectedGender
    );
  }

  // Budget filter
  if (filters.selectedMinBudget !== "") {
    filteredArtists = filteredArtists.filter(
      (artist) =>
        parsePrice(artist.price) >=
        parseInt(filters.selectedMinBudget.replace(/,/g, ""), 10)
    );
  }

  if (filters.selectedMaxBudget !== "") {
    filteredArtists = filteredArtists.filter(
      (artist) =>
        parsePrice(artist.price) <=
        parseInt(filters.selectedMaxBudget.replace(/,/g, ""), 10)
    );
  }

  // Search Query filter
  if (filters.searchQuery !== "") {
    filteredArtists = filteredArtists.filter((artist) =>
      artist.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
  }

  // Date filter
  if (filters.selectedDate !== "") {
    filteredArtists = filteredArtists.filter(
      (artist) =>
        !artist.busyDates.includes(new Date(filters.selectedDate).toISOString())
    );
  }

  // Sorting
  if (filters.selectedSortOption === "Low to High") {
    filteredArtists.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (filters.selectedSortOption === "High to Low") {
    filteredArtists.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  return filteredArtists;
};

// Helper function to extract filters (topGenres, topEventTypes, etc.)
const extractFilters = (artists) => {
  const uniqueCategories = [
    "All Artist Types",
    ...new Set(artists.map((artist) => artist.artistType)),
  ];

  const allGenres = artists.flatMap((artist) => artist.genre?.split(", "));
  const uniqueGenres = [...new Set(allGenres)];

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

  const eventTypeFrequency = allEventTypes.reduce((acc, eventType) => {
    acc[eventType] = (acc[eventType] || 0) + 1;
    return acc;
  }, {});
  const topEventTypes = Object.entries(eventTypeFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([eventType]) => eventType);

  const uniqueGenders = [
    "All",
    ...new Set(artists.map((artist) => artist.gender)),
  ];

  return {
    categories: uniqueCategories,
    genres: uniqueGenres,
    topGenres,
    locations: uniqueLocations,
    eventsTypes: uniqueEventsTypes,
    topEventTypes,
    genders: uniqueGenders,
  };
};

export async function GET(req) {
  await connectToDB();

  const { searchParams } = new URL(req.url);

  // Extract query parameters with default values
  const selectedCategory =
    searchParams.get("selectedCategory") || "All Artist Types";
  const selectedGenre = searchParams.get("selectedGenre") || "";
  const selectedLocation =
    searchParams.get("selectedLocation") || "All Locations";
  const selectedEventType =
    searchParams.get("selectedEventType") || "All Event Types";
  const selectedGender = searchParams.get("selectedGender") || "All";
  const minBudget = searchParams.get("minBudget") || "";
  const maxBudget = searchParams.get("maxBudget") || "";
  const searchQuery = searchParams.get("searchQuery") || "";
  const selectedDate = searchParams.get("selectedDate") || "";
  const selectedSortOption =
    searchParams.get("selectedSortOption") || "Low to High";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const filters = {
    selectedCategory,
    selectedGenre: selectedGenre ? selectedGenre?.split(",") : [],
    selectedLocation,
    selectedEventType,
    selectedGender,
    selectedMinBudget: minBudget,
    selectedMaxBudget: maxBudget,
    searchQuery,
    selectedDate,
    selectedSortOption,
    page,
  };

  try {
    // Fetch all artists from the database that match the filter
    const artists = await Artist.find({ showGigsar: true }).exec();

    // Apply filtering and sorting logic
    const filteredArtists = filterAndSortArtists(artists, filters);

    // Pagination
    const totalPages = Math.ceil(filteredArtists.length / 12);
    const paginatedArtists = filteredArtists.slice(
      (filters.page - 1) * 12,
      filters.page * 12
    );

    // Extract available filters from the filtered artists
    const extractedFilters = extractFilters(filteredArtists);

    // Return paginated artists along with total pages and filter data
    return new Response(
      JSON.stringify({
        artists: paginatedArtists,
        totalPages,
        page: filters.page,
        filters: extractedFilters,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching artists:", error.message);

    // Return an error response
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const dynamic = "force-dynamic";
