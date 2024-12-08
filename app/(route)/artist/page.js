"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ArtistList from "@/app/_components/ArtistList";
import { HashLoader } from "react-spinners";
import * as animationData from "../../../public/cat.json";
import LottieImg from "@/app/_components/Lottie";
import FilterPanel from "@/app/_components/Filter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function ArtistFilter() {
  const searchParams = useSearchParams();
  const filterParams = new URLSearchParams(searchParams.toString());

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [],
    genres: [],
    locations: [],
    eventsTypes: [],
    gender: [],
    topGenres: [],
    topEventTypes: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    category: "All Artist Types",
    genre: [],
    location: "All Locations",
    eventType: "All Event Types",
    gender: "All",
    minBudget: "",
    maxBudget: "",
    searchQuery: "",
    sortOption: "High to Low",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [applyFilter, setApplyFilter] = useState(false);

  // Fetch initial filters (but skip artists if filters are applied in the URL)
  useEffect(() => {
    fetchInitialFilters();
  }, []);

  const fetchInitialFilters = async () => {
    setLoading(true);
    try {
      const filtersResponse = await axios.get(`/api/artists/filters`);
      setFilters(filtersResponse.data); // This includes topGenres and topEventTypes
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract filters from URL and apply them
  useEffect(() => {
    const params = Object.fromEntries(filterParams.entries());

    const updatedFilters = {
      category: params.category || "All Artist Types",
      genre: params.genre ? params.genre.split(",") : [],
      location: params.location || "All Locations",
      eventType: params.eventType || "All Event Types",
      gender: params.gender || "All",
      minBudget: params.minBudget || "",
      maxBudget: params.maxBudget || "",
      searchQuery: params.searchQuery || "",
      sortOption: params.sortOption || "High to Low",
    };

    console.log(updatedFilters);

    setSelectedFilters(updatedFilters);
    // Trigger fetching artists after filters are applied
    setApplyFilter(true);
  }, [searchParams]);

  // Fetch filtered artists based on selected filters and current page
  const fetchFilteredArtists = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/artists`, {
        params: {
          ...selectedFilters,
          genre: selectedFilters.genre.join(","), // Convert array to comma-separated string
          page,
        },
      });
      setArtists(response.data.artists);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFilters, page]);

  // Handle the conditional fetching of artists
  useEffect(() => {
    if (applyFilter || page > 1) {
      fetchFilteredArtists(); // Fetch only when filters are applied
      setApplyFilter(false);
    }
  }, [applyFilter, fetchFilteredArtists, page]);

  useEffect(() => {
    // Check if there are no search params and if page is 1
    if (!searchParams.toString() && page === 1) {
      fetchFilteredArtists(); // Fetch when no search params and page is 1
    }
  }, [page, searchParams]);

  const handleFilterChange = (newFilters) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setPage(1); // Reset to page 1 when filter changes
  };

  const handleClearFilter = () => {
    setSelectedFilters({
      category: "All Artist Types",
      genre: [],
      location: "All Locations",
      eventType: "All Event Types",
      gender: "All",
      minBudget: "",
      maxBudget: "",
      searchQuery: "",
      sortOption: "High to Low",
    });
    setApplyFilter(true);
    setPage(1); // Reset to page 1 when filters are cleared
  };

  const handleCopyLink = () => {
    const filteredURL = new URL(window.location.href);
    const params = new URLSearchParams();

    // Ensure selectedFilters are properly formatted for URL
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        // Join array values
        params.set(key, value.join(","));
      } else if (value && value !== "All" && value !== "") {
        // Include only non-default values
        params.set(key, value);
      }
    });

    filteredURL.search = params.toString();

    navigator.clipboard
      .writeText(filteredURL.toString())
      .then(() => {
        alert("Filters copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy filters:", error);
      });
  };

  const handleSearch = () => {
    setApplyFilter(true);
    setPage(1); // Reset to page 1 on search
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="items-center px-5 flex flex-col gap-2">
        <div className="flex w-full mt-3 max-w-sm items-center">
          <Input
            className="flex-grow"
            type="text"
            placeholder="Search By Artist Name..."
            value={selectedFilters.searchQuery}
            onChange={(e) => {
              handleFilterChange({ searchQuery: e.target.value });
            }}
            onKeyDown={handleKeyDown}
          />
          <Button className="ml-2 w-auto" onClick={handleSearch}>
            <Search />
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <FilterPanel
          categories={filters.categories}
          genres={filters.genres}
          locations={filters.locations}
          eventsTypes={filters.eventsTypes}
          genders={filters.gender}
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          setApplyFilter={setApplyFilter}
          handleClearFilter={handleClearFilter}
          handleCopyLink={handleCopyLink}
          topGenres={filters.topGenres}
          topEventTypes={filters.topEventTypes}
        />
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <HashLoader color="#dc2626" size={100} />
            </div>
          ) : artists?.length > 0 ? (
            <ArtistList
              artists={artists}
              selectedCategory={selectedFilters.category}
              selectedGenre={selectedFilters.genre}
              selectedLocation={selectedFilters.location}
              selectedEventType={selectedFilters.eventType}
              selectedGenders={selectedFilters.gender}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* <LottieImg
                animationData={animationData}
                width={400}
                height={400}
              /> */}
              <p className="text-lg font-bold mt-4">No artists found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ArtistFilter;
