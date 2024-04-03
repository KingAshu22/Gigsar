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
  const [selectedCategory, setSelectedCategory] = useState("All Artist Types");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedInstrument, setSelectedInstrument] =
    useState("All Instruments");

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
      ...new Set(artists.flatMap((artist) => artist.instruments.split(", "))),
    ];
    setInstruments(uniqueInstruments);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleEventTypeChange = (event) => {
    setSelectedEventType(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleInstrumentChange = (event) => {
    setSelectedInstrument(event.target.value);
  };

  const filteredArtists = artists.filter((artist) => {
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
      artist.instruments.split(", ").includes(selectedInstrument);
    return (
      matchesCategory &&
      matchesGenre &&
      matchesLocation &&
      matchesEventType &&
      matchesLanguage &&
      matchesInstrument
    );
  });

  // Define your custom theme
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
        <div className="flex flex-wrap items-end gap-4">
          {/* Artist Type Filter */}
          <div>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Artist Types</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
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

          {/* Genre Filter */}
          <div>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={selectedGenre}
                onChange={handleGenreChange}
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

          {/* Location Filter */}
          <div>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Locations</InputLabel>
              <Select
                value={selectedLocation}
                onChange={handleLocationChange}
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

          {/* Events Type Filter */}
          <div>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Event Types</InputLabel>
              <Select
                value={selectedEventType}
                onChange={handleEventTypeChange}
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

          {/* Languages Filter */}
          <div>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Languages</InputLabel>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
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

          {/* Instruments Filter */}
          <div>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Instruments</InputLabel>
              <Select
                value={selectedInstrument}
                onChange={handleInstrumentChange}
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
