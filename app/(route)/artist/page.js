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
    genders: [],
    topGenres: [],
    topEventTypes: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    category: "All Artist Types",
    genre: [],
    location: "All Locations",
    eventType: "All Event Types",
    genders: "All",
    minBudget: "",
    maxBudget: "",
    searchQuery: "",
    sortOption: "Low to High",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [applyFilter, setApplyFilter] = useState(false);

  // Fetch initial artists and filters
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [artistsResponse, filtersResponse] = await Promise.all([
        axios.get(`/api/artists`, { params: { page, limit: 12 } }),
        axios.get(`/api/artists/filters`),
      ]);

      setArtists(artistsResponse.data.artists);
      setTotalPages(artistsResponse.data.totalPages);
      setFilters(filtersResponse.data); // This includes topGenres and topEventTypes
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract filters from URL and apply them
  useEffect(() => {
    const params = Object.fromEntries(filterParams.entries());

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      category: params.selectedCategory || "All Artist Types",
      genre: params.selectedGenre ? params.selectedGenre.split(",") : [],
      location: params.selectedLocation || "All Locations",
      eventType: params.selectedEventType || "All Event Types",
      genders: params.selectedGender || "All",
      minBudget: params.minBudget || "",
      maxBudget: params.maxBudget || "",
      searchQuery: params.searchQuery || "",
      sortOption: params.selectedSortOption || "Low to High",
    }));

    fetchFilteredArtists();
  }, [searchParams, page]);

  // Fetch filtered artists based on selected filters
  const fetchFilteredArtists = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/artists`, {
        params: {
          ...selectedFilters,
          genre: selectedFilters.genre.join(","),
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

  const handleFilterChange = (newFilters) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  useEffect(() => {
    if (applyFilter || page > 1) {
      fetchFilteredArtists();
      setApplyFilter(false);
    }
  }, [applyFilter, selectedFilters, page, fetchFilteredArtists]);

  const handleClearFilter = () => {
    setSelectedFilters({
      category: "All Artist Types",
      genre: [],
      location: "All Locations",
      eventType: "All Event Types",
      genders: "All",
      minBudget: "",
      maxBudget: "",
      searchQuery: "",
      sortOption: "Low to High",
    });
    setApplyFilter(true);
  };

  const handleCopyLink = () => {
    const filteredURL = new URL(window.location.href);
    const params = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([key, value]) => {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
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
            onChange={(e) =>
              handleFilterChange({ searchQuery: e.target.value })
            }
            onKeyDown={handleKeyDown}
          />
          <Button className="ml-2 w-auto" onClick={handleSearch}>
            <Search />
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row p-4">
        <FilterPanel
          categories={filters.categories}
          genres={filters.genres}
          locations={filters.locations}
          eventsTypes={filters.eventsTypes}
          genders={filters.genders}
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
              <HashLoader color="#dc2626" size={180} />
            </div>
          ) : artists.length > 0 ? (
            <ArtistList
              artists={artists}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <LottieImg
                animationData={animationData}
                width={400}
                height={400}
              />
              <p className="text-lg font-bold mt-4">No artists found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ArtistFilter;
