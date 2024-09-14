"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ArtistList from "@/app/_components/ArtistList";
import { HashLoader } from "react-spinners";
import { budgetOptions } from "./budget";
import FilterPanel from "@/app/_components/Filter";

function ArtistFilter() {
  const searchParams = useSearchParams();
  const filterParams = new URLSearchParams(searchParams.toString());
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [topLanguages, setTopLanguages] = useState([]);
  const [topInstruments, setTopInstruments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [eventsTypes, setEventsTypes] = useState([]);
  const [topEventTypes, setTopEventTypes] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [genders, setGenders] = useState(["All"]);
  const [budget, setBudget] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Artist Types");
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState([]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSortOption, setSelectedSortOption] = useState("Low to High");
  const [sortedArtists, setSortedArtists] = useState([]);
  const [selectedMinBudget, setSelectedMinBudget] = useState("");
  const [selectedMaxBudget, setSelectedMaxBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);

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
      selectedLanguage,
      selectedInstrument,
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
    setSelectedLanguage(selectedLanguage ? selectedLanguage.split(",") : []);
    setSelectedInstrument(
      selectedInstrument ? selectedInstrument.split(",") : []
    );
    setSelectedGender(selectedGender || "All");
    setSelectedSortOption(selectedSortOption || "Low to High");
    setSelectedMinBudget(minBudget || "");
    setSelectedMaxBudget(maxBudget || "");
    fetchArtists();
  }, [searchParams]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/artists");
      const filteredArtists = response.data.filter(
        (artist) => artist.showGigsar
      );
      setArtists(filteredArtists);
      extractFilters(filteredArtists);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractFilters = async (artists) => {
    let filteredArtists = artists;

    if (selectedCategory !== "All Artist Types") {
      filteredArtists = filteredArtists.filter(
        (artist) => artist.artistType === selectedCategory
      );
    }

    if (selectedGenre.length > 0) {
      filteredArtists = filteredArtists.filter((artist) =>
        selectedGenre.every((genre) => artist.genre.split(", ").includes(genre))
      );
    }

    if (selectedLocation !== "All Locations") {
      filteredArtists = filteredArtists.filter(
        (artist) => artist.location === selectedLocation
      );
    }

    if (selectedEventType !== "All Event Types") {
      filteredArtists = filteredArtists.filter((artist) =>
        artist.eventsType.split(", ").includes(selectedEventType)
      );
    }

    if (selectedLanguage.length > 0) {
      filteredArtists = filteredArtists.filter((artist) =>
        selectedLanguage.every((language) =>
          artist.languages.split(", ").includes(language)
        )
      );
    }

    if (selectedInstrument.length > 0) {
      filteredArtists = filteredArtists.filter((artist) =>
        selectedInstrument.every((instrument) =>
          artist.instruments
            ? artist.instruments.split(", ").includes(instrument)
            : false
        )
      );
    }

    if (selectedGender !== "All") {
      filteredArtists = filteredArtists.filter(
        (artist) => artist.gender === selectedGender
      );
    }

    const uniqueCategories = [
      "All Artist Types",
      ...new Set(artists.map((artist) => artist.artistType)),
    ];
    setCategories(uniqueCategories);

    const allGenres = filteredArtists.flatMap((artist) =>
      artist.genre.split(", ")
    );
    const uniqueGenres = [...new Set(allGenres)];
    setGenres(uniqueGenres);

    // Calculate top 10 genres based on frequency
    const genreFrequency = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    const sortedGenres = Object.entries(genreFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre]) => genre);
    setTopGenres(sortedGenres);

    const uniqueLocations = [
      "All Locations",
      ...new Set(artists.map((artist) => artist.location)),
    ];
    setLocations(uniqueLocations);

    const response = await axios.get("https://ipapi.co/json/");
    const { city } = response.data;

    if (!initialLocationSet && uniqueLocations.includes(city)) {
      setSelectedLocation(city);
      setInitialLocationSet(true);
    }

    const allEventTypes = filteredArtists.flatMap((artist) =>
      artist.eventsType.split(", ")
    );
    const uniqueEventsTypes = ["All Event Types", ...new Set(allEventTypes)];
    setEventsTypes(uniqueEventsTypes);

    // Calculate top event types based on frequency
    const eventsFrequency = allEventTypes.reduce((acc, eventsType) => {
      acc[eventsType] = (acc[eventsType] || 0) + 1;
      return acc;
    }, {});
    const sortedEventTypes = Object.entries(eventsFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([eventsType]) => eventsType);
    const uniqueSortedEventTypes = [
      "All Event Types",
      ...new Set(sortedEventTypes),
    ];
    setTopEventTypes(uniqueSortedEventTypes);

    const allLanguages = filteredArtists.flatMap((artist) =>
      artist.languages.split(", ")
    );
    const languageFrequency = allLanguages.reduce((acc, language) => {
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {});
    const sortedLanguages = Object.entries(languageFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([language]) => language);
    setLanguages(allLanguages);
    setTopLanguages(sortedLanguages);

    const allInstruments = filteredArtists.flatMap((artist) =>
      artist.instruments ? artist.instruments.split(", ") : []
    );
    const instrumentFrequency = allInstruments.reduce((acc, instrument) => {
      acc[instrument] = (acc[instrument] || 0) + 1;
      return acc;
    }, {});
    const sortedInstruments = Object.entries(instrumentFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([instrument]) => instrument);
    setInstruments(allInstruments);
    setTopInstruments(sortedInstruments);

    const uniqueGenders = [
      "All",
      ...new Set(filteredArtists.map((artist) => artist.gender)),
    ];
    setGenders(uniqueGenders);

    setFilteredArtists(filteredArtists);
  };

  useEffect(() => {
    extractFilters(artists);
  }, [
    artists,
    selectedCategory,
    selectedGenre,
    selectedLocation,
    selectedEventType,
    selectedLanguage,
    selectedInstrument,
    selectedGender,
  ]);

  useEffect(() => {
    if (selectedSortOption === "Low to High") {
      setSortedArtists(
        [...filteredArtists].sort(
          (a, b) => parsePrice(a.price) - parsePrice(b.price)
        )
      );
    } else if (selectedSortOption === "High to Low") {
      setSortedArtists(
        [...filteredArtists].sort(
          (a, b) => parsePrice(b.price) - parsePrice(a.price)
        )
      );
    } else {
      setSortedArtists([...filteredArtists]);
    }

    if (selectedEventType === "Corporate") {
      setBudget("corporateBudget");
    } else if (selectedEventType === "College") {
      setBudget("collegeBudget");
    } else if (selectedEventType === "Wedding") {
      setBudget("price");
    } else if (selectedEventType === "Reception") {
      setBudget("price");
    } else if (selectedEventType === "Haldi") {
      setBudget("price");
    } else if (selectedEventType === "Mehendi") {
      setBudget("price");
    } else if (selectedEventType === "Mayra/Bhaat") {
      setBudget("price");
    } else if (selectedEventType === "Musical/Vedic Pheras") {
      setBudget("price");
    } else if (selectedEventType === "Sangeet") {
      setBudget("price");
    } else if (selectedEventType === "House Party") {
      setBudget("singerCumGuitarist");
    } else if (selectedEventType === "Ticketing Concert") {
      setBudget("ticketingConcertBudget");
    } else if (selectedEventType === "Virtual") {
      setBudget("singerCumGuitarist");
    }
  }, [selectedSortOption, filteredArtists, selectedEventType, searchQuery]);

  const finalArtists = sortedArtists.filter((artist) => {
    const matchesCategory =
      selectedCategory === "All Artist Types" ||
      artist.artistType === selectedCategory;
    const matchesGenre =
      selectedGenre.length === 0 ||
      selectedGenre.every((genre) => artist.genre.split(", ").includes(genre));
    const matchesEventType =
      selectedEventType === "All Event Types" ||
      artist.eventsType.split(", ").includes(selectedEventType);
    const matchesLanguage =
      selectedLanguage.length === 0 ||
      selectedLanguage.every((language) =>
        artist.languages.split(", ").includes(language)
      );
    const matchesInstrument =
      selectedInstrument.length === 0 ||
      selectedInstrument.every(
        (instrument) =>
          artist.instruments &&
          artist.instruments.split(", ").includes(instrument)
      );
    const matchesGender =
      selectedGender === "All" || artist.gender === selectedGender;
    const matchesMinBudget =
      selectedMinBudget === "" ||
      parsePrice(artist.price) >=
        parseInt(selectedMinBudget.replace(/,/g, ""), 10);
    const matchesMaxBudget =
      selectedMaxBudget === "" ||
      parsePrice(artist.price) <=
        parseInt(selectedMaxBudget.replace(/,/g, ""), 10);
    const matchesSearchQuery =
      searchQuery === "" ||
      artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      !selectedDate ||
      !artist.busyDates.includes(new Date(selectedDate).toISOString());

    return (
      matchesCategory &&
      matchesGenre &&
      matchesEventType &&
      matchesLanguage &&
      matchesInstrument &&
      matchesGender &&
      matchesMinBudget &&
      matchesMaxBudget &&
      matchesSearchQuery &&
      matchesDate
    );
  });

  const handleClearFilter = () => {
    setSelectedCategory("All Artist Types");
    setSelectedGenre([]);
    setSelectedLocation("All Locations");
    setSelectedEventType("All Event Types");
    setSelectedDate("");
    setSelectedLanguage([]);
    setSelectedInstrument([]);
    setSelectedGender("All");
    setSelectedSortOption("Low to High");
    setSelectedMinBudget("");
    setSelectedMaxBudget("");
    setSearchQuery("");
  };

  const handleCopyLink = () => {
    const filteredURL = new URL(window.location.href);
    const params = new URLSearchParams();
    params.set("selectedCategory", selectedCategory);
    params.set("selectedGenre", selectedGenre.join(","));
    params.set("selectedLocation", selectedLocation);
    params.set("selectedEventType", selectedEventType);
    params.set("selectedDate", selectedDate);
    params.set("selectedLanguage", selectedLanguage.join(","));
    params.set("selectedInstrument", selectedInstrument.join(","));
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
    <div className="flex flex-col lg:flex-row p-4">
      <FilterPanel
        categories={categories}
        genres={genres}
        topGenres={topGenres}
        location={locations}
        eventsTypes={eventsTypes}
        topEventTypes={topEventTypes}
        languages={languages}
        topLanguages={topLanguages}
        instruments={instruments}
        topInstruments={topInstruments}
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
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedInstrument={selectedInstrument}
        setSelectedInstrument={setSelectedInstrument}
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
        ) : filteredArtists.length > 0 ? (
          <ArtistList
            artists={finalArtists}
            selectedCategory={selectedCategory}
            selectedGenre={selectedGenre.join(",")}
            selectedLocation={selectedLocation}
            selectedEventType={selectedEventType}
            selectedDate={selectedDate}
            selectedLanguage={selectedLanguage.join(",")}
            selectedInstrument={selectedInstrument.join(",")}
            selectedGender={selectedGender}
            selectedMinBudget={selectedMinBudget}
            selectedMaxBudget={selectedMaxBudget}
            budget={budget}
          />
        ) : (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              className="h-[220px] bg-slate-200 w-full rounded-lg animate-pulse"
              key={index}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default ArtistFilter;
