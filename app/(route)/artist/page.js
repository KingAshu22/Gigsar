"use client";
import { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import ArtistList from "@/app/_components/ArtistList";
import axios from "axios";

function Search() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [locations, setLocations] = useState([]);
  const [eventsTypes, setEventsTypes] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [genders, setGenders] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All Artist Types");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedInstrument, setSelectedInstrument] =
    useState("All Instruments");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSortOption, setSelectedSortOption] = useState("Low to High"); // Default to Low to High
  const [sortedArtists, setSortedArtists] = useState([]);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/artist`)
      .then((response) => {
        setArtists(response.data);
        extractFilters(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
        setLoading(false);
      });
  };

  const extractFilters = (artists) => {
    const uniqueCategories = [
      "All Artist Types",
      ...new Set(artists.map((artist) => artist.artistType)),
    ];
    setCategories(uniqueCategories);

    const uniqueGenres = [
      "All Genres",
      ...new Set(artists.flatMap((artist) => artist.genre.split(", "))),
    ];
    setGenres(uniqueGenres);

    const uniqueLocations = [
      "All Locations",
      ...new Set(artists.map((artist) => artist.location)),
    ];
    setLocations(uniqueLocations);

    const uniqueEventsTypes = [
      "All Event Types",
      ...new Set(artists.flatMap((artist) => artist.eventsType.split(", "))),
    ];
    setEventsTypes(uniqueEventsTypes);

    const uniqueLanguages = [
      "All Languages",
      ...new Set(artists.flatMap((artist) => artist.languages.split(", "))),
    ];
    setLanguages(uniqueLanguages);

    const uniqueInstruments = [
      "All Instruments",
      ...new Set(
        artists.flatMap((artist) =>
          artist.instruments ? artist.instruments.split(", ") : []
        )
      ),
    ];
    setInstruments(uniqueInstruments);

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
  }, [selectedSortOption, artists]);

  const parsePrice = (priceString) => {
    return parseInt(priceString.replace(/,/g, ""), 10);
  };

  const filteredArtists = sortedArtists.filter((artist) => {
    const matchesCategory =
      selectedCategory === "All Artist Types" ||
      artist.artistType === selectedCategory;
    const matchesGenre =
      selectedGenre === "All Genres" ||
      artist.genre.split(", ").includes(selectedGenre);
    const matchesLocation =
      selectedLocation === "All Locations" ||
      artist.location === selectedLocation;
    const matchesEventType =
      selectedEventType === "All Event Types" ||
      artist.eventsType.split(", ").includes(selectedEventType);
    const matchesLanguage =
      selectedLanguage === "All Languages" ||
      artist.languages.split(", ").includes(selectedLanguage);
    const matchesInstrument =
      selectedInstrument === "All Instruments" ||
      (artist.instruments &&
        artist.instruments.split(", ").includes(selectedInstrument));
    const matchesGender =
      selectedGender === "All" || artist.gender === selectedGender;

    return (
      matchesCategory &&
      matchesGenre &&
      matchesLocation &&
      matchesEventType &&
      matchesLanguage &&
      matchesInstrument &&
      matchesGender
    );
  });

  const theme = createTheme({
    typography: {
      fontFamily: '"Your Custom Font", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="mt-5 mx-5">
        <h3>Filters</h3>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 xl:grid-cols-8 gap-4">
          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Artist Types</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                label="Artist Types"
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Genre</InputLabel>
              <Select
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
                label="Genre"
              >
                {genres.map((genre, index) => (
                  <MenuItem key={index} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Locations</InputLabel>
              <Select
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
                label="Locations"
              >
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Event Types</InputLabel>
              <Select
                value={selectedEventType}
                onChange={(event) => setSelectedEventType(event.target.value)}
                label="Event Types"
              >
                {eventsTypes.map((eventType, index) => (
                  <MenuItem key={index} value={eventType}>
                    {eventType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Gender</InputLabel>
              <Select
                value={selectedGender}
                onChange={(event) => setSelectedGender(event.target.value)}
                label="Gender"
              >
                {genders.map((gender, index) => (
                  <MenuItem key={index} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Languages</InputLabel>
              <Select
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                label="Languages"
              >
                {languages.map((language, index) => (
                  <MenuItem key={index} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Instruments</InputLabel>
              <Select
                value={selectedInstrument}
                onChange={(event) => setSelectedInstrument(event.target.value)}
                label="Instruments"
              >
                {instruments.map((instrument, index) => (
                  <MenuItem key={index} value={instrument}>
                    {instrument}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Budget</InputLabel>
              <Select
                value={selectedSortOption}
                onChange={(event) => setSelectedSortOption(event.target.value)}
                label="Budget"
              >
                <MenuItem value="Low to High">Low to High</MenuItem>
                <MenuItem value="High to Low">High to Low</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : filteredArtists.length > 0 ? (
          <ArtistList
            artists={filteredArtists}
            heading={`${selectedCategory} - ${selectedGenre} - ${selectedLocation} - ${selectedEventType} - ${selectedLanguage} - ${selectedInstrument}`}
          />
        ) : (
          <p>No artists found.</p>
        )}
      </div>
    </ThemeProvider>
  );
}

export default Search;
