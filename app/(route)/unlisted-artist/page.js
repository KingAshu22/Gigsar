"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import ArtistList from "@/app/_components/ArtistList";
import { HashLoader } from "react-spinners";
import FilterPanel from "@/app/_components/Filter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

function ArtistFilter() {
  const router = useRouter();
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
    eventType: "",
    gender: "All",
    minBudget: "",
    maxBudget: "",
    searchQuery: "",
    sortOption: "High to Low",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [applyFilter, setApplyFilter] = useState(false);
  const [pin, setPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isError, setIsError] = useState(false); // To trigger error state
  const [errorMsg, setErrorMsg] = useState(""); // For error message

  // Fetch initial filters (but skip artists if filters are applied in the URL)

  useEffect(() => {
    const params = new URLSearchParams();
    if (
      selectedFilters.category &&
      !selectedFilters.category.includes("All Artist Types")
    ) {
      params.set("category", selectedFilters.category);
    }
    if (selectedFilters.genre.length > 0) {
      params.set("genre", selectedFilters.genre.join(","));
    }
    if (
      selectedFilters.location &&
      !selectedFilters.location.includes("All Locations")
    ) {
      params.set("location", selectedFilters.location);
    }
    if (selectedFilters.eventType) {
      params.set("eventType", selectedFilters.eventType);
    }
    if (selectedFilters.gender && !selectedFilters.gender.includes("All")) {
      params.set("gender", selectedFilters.gender);
    }
    if (selectedFilters.minBudget) {
      params.set("minBudget", selectedFilters.minBudget);
    }
    if (selectedFilters.maxBudget) {
      params.set("maxBudget", selectedFilters.maxBudget);
    }
    if (selectedFilters.searchQuery) {
      params.set("searchQuery", selectedFilters.searchQuery);
    }
    if (selectedFilters.sortOption) {
      params.set("sortOption", selectedFilters.sortOption);
    }
    if (page > 1) {
      params.set("page", page);
    }
    router.push(`?${params.toString()}`, undefined, {
      shallow: true,
    });
  }, [selectedFilters, page]);

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/get-pin`);
        if (response.ok) {
          const data = await response.json();
          setPin(data.pin.toString() || ""); // Set pin to the fetched pin
        }
      } catch (error) {
        console.error("Failed to fetch pin:", error);
      }
    };

    fetchPin();
  }, []);

  useEffect(() => {
    fetchInitialFilters();
  }, []);

  // Check localStorage for saved PIN only after the fetched PIN is available
  useEffect(() => {
    const savedPin = localStorage.getItem("userPin");

    // Only proceed if pin is fetched and available
    if (pin && savedPin && savedPin.toString() === pin) {
      setIsUnlocked(true); // Unlock if the correct PIN is saved
    }
  }, [pin]); // Depend on `pin` to run this effect only after pin is fetched

  const handleKeyPress = (value) => {
    if (enteredPin.length < 4) {
      setEnteredPin((prev) => prev + value);
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (enteredPin.length === 4) {
      if (enteredPin === pin) {
        localStorage.setItem("userPin", pin);
        setIsUnlocked(true); // Unlock if PIN is correct
      } else {
        setErrorMsg("Incorrect PIN, try again");
        setIsError(true);

        setTimeout(() => {
          setIsError(false);
          setEnteredPin("");
          setErrorMsg(""); // Clear the error message
        }, 2000);
      }
    }
  }, [enteredPin]);

  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (e.key >= "0" && e.key <= "9" && enteredPin.length < 4) {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyboardInput);
    return () => {
      window.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [enteredPin]);

  const fetchInitialFilters = async () => {
    setLoading(true);
    try {
      const filtersResponse = await axios.get(`/api/unlisted-artist/filters`);
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
      eventType: params.eventType || "",
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
      const response = await axios.get(`/api/unlisted-artist`, {
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
      eventType: "",
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

  if (isUnlocked) {
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
        <div className="flex flex-col lg:flex-row p-4">
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
            ) : artists.length > 0 ? (
              <ArtistList
                artists={artists}
                selectedFilters={selectedFilters}
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

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white md:bg-gray-100">
      <div className="w-full max-w-xs p-8 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-6">Enter Your PIN</h2>
        <div className="mb-6">
          {/* Display entered pin */}
          <div
            className={clsx("flex justify-center mb-4", {
              "animate-shake": isError, // Add shake animation on error
            })}
          >
            {Array(4)
              .fill("")
              .map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    "h-4 w-4 mx-1 rounded-full transition-colors duration-300",
                    {
                      "bg-red-500": isError, // Red when there is an error
                      "bg-black": i < enteredPin.length && !isError,
                      "bg-gray-300": i >= enteredPin.length && !isError,
                    }
                  )}
                ></span>
              ))}
          </div>
          {isError && (
            <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>
          )}
        </div>
        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
            <button
              key={key}
              className="p-4 bg-gray-200 hover:bg-primary rounded-full text-lg font-bold focus:outline-none"
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="p-4 px-8 bg-gray-200 hover:bg-primary rounded-full text-lg font-bold focus:outline-none"
            onClick={() => handleKeyPress("0")}
          >
            0
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="p-4 bg-gray-200 rounded-full text-lg font-bold focus:outline-none"
            onClick={handleBackspace}
          >
            ←
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArtistFilter;
