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

function ArtistFilter() {
  const searchParams = useSearchParams();
  const filterParams = new URLSearchParams(searchParams.toString());
  console.log(filterParams);
  const [artists, setArtists] = useState([]);
  const [budget, setBudget] = useState("");
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
  const [selectedCategory, setSelectedCategory] = useState("All Artist Types");
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState([]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSortOption, setSelectedSortOption] = useState("Low to High");
  const [selectedMinBudget, setSelectedMinBudget] = useState("");
  const [selectedMaxBudget, setSelectedMaxBudget] = useState("");
  const [sortedArtists, setSortedArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = Object.fromEntries(filterParams.entries());

    const {
      selectedCategory,
      selectedGenre,
      selectedLocation,
      selectedEventType,
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/artist`);
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

  const extractFilters = (artists) => {
    const uniqueCategories = [
      "All Artist Types",
      ...new Set(artists.map((artist) => artist.artistType)),
    ];
    setCategories(uniqueCategories);

    const allGenres = artists.flatMap((artist) => artist.genre.split(", "));
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

    const allEventTypes = artists.flatMap((artist) =>
      artist.eventsType.split(", ")
    );
    const uniqueEventsTypes = ["All Event Types", ...new Set(allEventTypes)];
    setEventsTypes(uniqueEventsTypes);

    // Calculate top 10 genres based on frequency
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

    // Collect all languages from artists
    const allLanguages = artists.flatMap((artist) =>
      artist.languages.split(", ")
    );

    // Calculate language frequency
    const languageFrequency = allLanguages.reduce((acc, language) => {
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {});

    // Sort languages by frequency and select top 10
    const sortedLanguages = Object.entries(languageFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([language]) => language);

    // Set state for all languages and top languages
    setLanguages(allLanguages);
    setTopLanguages(sortedLanguages);

    // Collect all instruments from artists
    const allInstruments = artists.flatMap((artist) =>
      artist.instruments ? artist.instruments.split(", ") : []
    );

    // Calculate instrument frequency
    const instrumentFrequency = allInstruments.reduce((acc, instrument) => {
      acc[instrument] = (acc[instrument] || 0) + 1;
      return acc;
    }, {});

    // Sort instruments by frequency and select top 10
    const sortedInstruments = Object.entries(instrumentFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([instrument]) => instrument);

    // Set state for all instruments and top instruments
    setInstruments(allInstruments);
    setTopInstruments(sortedInstruments);

    const uniqueGenders = [
      "All",
      ...new Set(artists.map((artist) => artist.gender)),
    ];
    setGenders(uniqueGenders);
  };

  useEffect(() => {
    if (selectedSortOption === "Low to High") {
      setSortedArtists(
        [...artists].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      );
    } else if (selectedSortOption === "High to Low") {
      setSortedArtists(
        [...artists].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      );
    } else {
      setSortedArtists([...artists]);
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
  }, [selectedSortOption, artists, selectedEventType]);

  const parsePrice = (priceString) => {
    return parseInt(priceString.replace(/,/g, ""), 10);
  };

  const filteredArtists = sortedArtists.filter((artist) => {
    const matchesCategory =
      selectedCategory === "All Artist Types" ||
      artist.artistType === selectedCategory;
    const matchesGenre =
      selectedGenre.length === 0 ||
      selectedGenre.every((genre) => artist.genre.split(", ").includes(genre));
    const matchesLocation =
      selectedLocation === "All Locations" ||
      artist.location.split(", ").includes(selectedLocation);
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
      matchesLocation &&
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
        className="desktop"
        categories={categories}
        topGenres={topGenres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        genres={genres}
        eventsTypes={eventsTypes}
        topEventTypes={topEventTypes}
        selectedEventType={selectedEventType}
        setSelectedEventType={setSelectedEventType}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        languages={languages}
        topLanguages={topLanguages}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        instruments={instruments}
        topInstruments={topInstruments}
        selectedInstrument={selectedInstrument}
        setSelectedInstrument={setSelectedInstrument}
        genders={genders}
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
            artists={filteredArtists}
            selectedEventType={
              selectedEventType === "All Event Types" ? "" : selectedEventType
            }
            budget={budget}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <LottieImg animationData={animationData} width={400} height={400} />
            <p className="text-lg font-bold mt-4">No artists found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistFilter;
