"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ArtistList from "@/app/_components/ArtistList";
import { HashLoader } from "react-spinners";
import * as animationData from "../../../public/cat.json";
import LottieImg from "@/app/_components/Lottie";
import { budgetOptions } from "./budget";
import FilterPanel from "@/app/_components/Filter";
import { Input } from "@/components/ui/input";

function ArtistFilter() {
  const searchParams = useSearchParams();
  const filterParams = new URLSearchParams(searchParams.toString());
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [locations, setLocations] = useState([]);
  const [eventsTypes, setEventsTypes] = useState([]);
  const [topEventTypes, setTopEventTypes] = useState([]);
  const [genders, setGenders] = useState(["All"]);
  const [budget, setBudget] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Artist Types");
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSortOption, setSelectedSortOption] = useState("Low to High");
  const [selectedMinBudget, setSelectedMinBudget] = useState("");
  const [selectedMaxBudget, setSelectedMaxBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const parsePrice = (priceString) => {
    return parseInt(priceString.replace(/,/g, ""), 10);
  };

  useEffect(() => {
    const params = Object.fromEntries(filterParams.entries());

    const {
      selectedCategory,
      selectedGenre,
      selectedLocation,
      selectedEventType,
      selectedDate,
      selectedGender,
      selectedSortOption,
      minBudget,
      maxBudget,
    } = params;

    setSelectedCategory(selectedCategory || "All Artist Types");
    setSelectedGenre(selectedGenre ? selectedGenre.split(",") : []);
    setSelectedLocation(selectedLocation || "All Locations");
    setSelectedEventType(selectedEventType || "All Event Types");
    setSelectedDate(selectedDate || "");
    setSelectedGender(selectedGender || "All");
    setSelectedSortOption(selectedSortOption || "Low to High");
    setSelectedMinBudget(minBudget || "");
    setSelectedMaxBudget(maxBudget || "");
    fetchArtists();
  }, [searchParams, page]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("selectedCategory", selectedCategory);
      params.set("selectedGenre", selectedGenre.join(","));
      params.set("selectedLocation", selectedLocation);
      params.set("selectedEventType", selectedEventType);
      params.set("selectedGender", selectedGender);
      params.set("minBudget", selectedMinBudget);
      params.set("maxBudget", selectedMaxBudget);
      params.set("searchQuery", searchQuery);
      params.set("selectedDate", selectedDate);
      params.set("page", page);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/gigsar-artist?${params.toString()}`
      );

      console.log(response.data);

      setTotalPages(response.data.totalPages);
      setArtists(response.data.artists);
      setCategories(response.data.filters.categories || []);
      setGenres(response.data.filters.genres || []);
      setTopGenres(response.data.filters.topGenres || []);
      setLocations(response.data.filters.locations || []);
      setEventsTypes(response.data.filters.eventTypes || []);
      setTopEventTypes(response.data.filters.topEventTypes || []);
      setGenders(response.data.filters.genders || []);
      setPage(response.data.page);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSortOption === "Low to High") {
      setArtists(
        [...artists].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      );
    } else if (selectedSortOption === "High to Low") {
      setArtists(
        [...artists].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      );
    }
  }, [selectedSortOption, artists]);

  useEffect(() => {
    fetchArtists();
  }, [
    searchQuery,
    selectedCategory,
    selectedGenre,
    selectedEventType,
    selectedDate,
    selectedLocation,
    selectedGender,
    selectedMinBudget,
    selectedMaxBudget,
    page,
  ]);

  const handleClearFilter = () => {
    setSelectedCategory("All Artist Types");
    setSelectedGenre([]);
    setSelectedLocation("All Locations");
    setSelectedEventType("All Event Types");
    setSelectedDate("");
    setSelectedGender("All");
    setSelectedSortOption("Low to High");
    setSelectedMinBudget("");
    setSelectedMaxBudget("");
    setSearchQuery("");
    fetchArtists();
  };

  const handleCopyLink = () => {
    const filteredURL = new URL(window.location.href);
    const params = new URLSearchParams();
    params.set("selectedCategory", selectedCategory);
    params.set("selectedGenre", selectedGenre.join(","));
    params.set("selectedLocation", selectedLocation);
    params.set("selectedEventType", selectedEventType);
    params.set("selectedDate", selectedDate);
    params.set("selectedGender", selectedGender);
    params.set("selectedSortOption", selectedSortOption);
    params.set("minBudget", selectedMinBudget);
    params.set("maxBudget", selectedMaxBudget);
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

  return (
    <>
      <div className="items-center px-5 flex flex-col gap-2">
        <div className="flex w-full mt-3 max-w-sm items-center">
          <Input
            type="text"
            placeholder="Search By Artist Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row p-4">
        <FilterPanel
          categories={categories}
          genres={genres}
          topGenres={topGenres}
          location={locations}
          eventsTypes={eventsTypes}
          topEventTypes={topEventTypes}
          genders={genders}
          budgetOptions={budgetOptions}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedEventType={selectedEventType}
          setSelectedEventType={setSelectedEventType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          selectedSortOption={selectedSortOption}
          setSelectedSortOption={setSelectedSortOption}
          selectedMinBudget={selectedMinBudget}
          setSelectedMinBudget={setSelectedMinBudget}
          selectedMaxBudget={selectedMaxBudget}
          setSelectedMaxBudget={setSelectedMaxBudget}
          handleClearFilter={handleClearFilter}
          handleCopyLink={handleCopyLink}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <HashLoader color="#dc2626" size={180} />
            </div>
          ) : artists.length > 0 ? (
            <ArtistList
              artists={artists}
              selectedCategory={selectedCategory}
              selectedGenre={selectedGenre.join(",")}
              selectedLocation={selectedLocation}
              selectedEventType={selectedEventType}
              selectedDate={selectedDate}
              selectedGender={selectedGender}
              selectedMinBudget={selectedMinBudget}
              selectedMaxBudget={selectedMaxBudget}
              budget={budget}
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
