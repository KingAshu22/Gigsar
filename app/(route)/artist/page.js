"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import ArtistList from "@/app/_components/ArtistList";
import axios from "axios";
import { Button } from "@/components/ui/button";

function Search() {
  const searchParams = useSearchParams();
  const filterParams = new URLSearchParams(searchParams.toString());
  console.log(filterParams);
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
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedEventType, setSelectedEventType] = useState("All Event Types");
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState([]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSortOption, setSelectedSortOption] = useState("Low to High");
  const [selectedMinBudget, setSelectedMinBudget] = useState("");
  const [selectedMaxBudget, setSelectedMaxBudget] = useState("");
  const [sortedArtists, setSortedArtists] = useState([]);

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
      setArtists(response.data);
      extractFilters(response.data);
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

    const uniqueGenres = [
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
      ...new Set(artists.flatMap((artist) => artist.languages.split(", "))),
    ];
    setLanguages(uniqueLanguages);

    const uniqueInstruments = [
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
      selectedGenre.length === 0 ||
      selectedGenre.every((genre) => artist.genre.split(", ").includes(genre));
    const matchesLocation =
      selectedLocation === "All Locations" ||
      artist.location === selectedLocation;
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

    return (
      matchesCategory &&
      matchesGenre &&
      matchesLocation &&
      matchesEventType &&
      matchesLanguage &&
      matchesInstrument &&
      matchesGender &&
      matchesMinBudget &&
      matchesMaxBudget
    );
  });

  const handleCopyLink = () => {
    const currentURL = window.location.href;
    const filteredURL = new URL(currentURL);
    const params = new URLSearchParams(filteredURL.search);
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
    navigator.clipboard.writeText(filteredURL.toString());
    alert("Filtered URL copied to clipboard!");
  };

  const theme = createTheme({
    typography: {
      fontFamily: '"Your Custom Font", sans-serif',
    },
  });

  const budgetOptions = [
    "10,000",
    "11,000",
    "12,000",
    "13,000",
    "14,000",
    "15,000",
    "16,000",
    "17,000",
    "18,000",
    "19,000",
    "20,000",
    "25,000",
    "30,000",
    "35,000",
    "40,000",
    "45,000",
    "50,000",
    "60,000",
    "70,000",
    "80,000",
    "90,000",
    "1,00,000",
    "1,25,000",
    "1,50,000",
    "1,75,000",
    "2,00,000",
    "2,50,000",
    "3,00,000",
    "3,50,000",
    "4,00,000",
    "4,50,000",
    "5,00,000",
    "6,00,000",
    "7,00,000",
    "8,00,000",
    "9,00,000",
    "10,00,000",
    "11,00,000",
    "12,00,000",
    "13,00,000",
    "14,00,000",
    "15,00,000",
    "16,00,000",
    "17,00,000",
    "18,00,000",
    "19,00,000",
    "20,00,000",
    "25,00,000",
    "30,00,000",
    "35,00,000",
    "40,00,000",
    "45,00,000",
    "50,00,000",
    "55,00,000",
    "60,00,000",
    "65,00,000",
    "70,00,000",
    "75,00,000",
    "80,00,000",
    "85,00,000",
    "90,00,000",
    "95,00,000",
    "1,00,00,000",
    "2,00,00,000",
    "3,00,00,000",
    "4,00,00,000",
    "5,00,00,000",
    "6,00,00,000",
    "7,00,00,000",
    "8,00,00,000",
    "9,00,00,000",
    "10,00,00,000",
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="mt-5 mx-5">
        <h3>Filters</h3>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 xl:grid-cols-10 gap-4">
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
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                multiple
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
                input={<OutlinedInput label="Genre" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    <Checkbox checked={selectedGenre.indexOf(genre) > -1} />
                    <ListItemText primary={genre} />
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
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Languages</InputLabel>
              <Select
                multiple
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                input={<OutlinedInput label="Languages" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    <Checkbox
                      checked={selectedLanguage.indexOf(language) > -1}
                    />
                    <ListItemText primary={language} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Instruments</InputLabel>
              <Select
                multiple
                value={selectedInstrument}
                onChange={(event) => setSelectedInstrument(event.target.value)}
                input={<OutlinedInput label="Instruments" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {instruments.map((instrument) => (
                  <MenuItem key={instrument} value={instrument}>
                    <Checkbox
                      checked={selectedInstrument.indexOf(instrument) > -1}
                    />
                    <ListItemText primary={instrument} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Minimum Budget</InputLabel>
              <Select
                value={selectedMinBudget}
                onChange={(event) => setSelectedMinBudget(event.target.value)}
                label="Minimum Budget"
              >
                {budgetOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined">
              <InputLabel>Maximum Budget</InputLabel>
              <Select
                value={selectedMaxBudget}
                onChange={(event) => setSelectedMaxBudget(event.target.value)}
                label="Maximum Budget"
              >
                {budgetOptions
                  .filter((option) => {
                    if (selectedMinBudget === "") return true;
                    return (
                      parseInt(option.replace(/,/g, ""), 10) >
                      parseInt(selectedMinBudget.replace(/,/g, ""), 10)
                    );
                  })
                  .map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
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
          <Button
            onClick={handleCopyLink}
            className="p-2 px-3 border-[1px] border-gray
                        text-primary bg-white w-auto text-center
                         mt-2 cursor-pointer hover:bg-primary hover:text-white"
          >
            Filter Link
          </Button>
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : filteredArtists.length > 0 ? (
          <ArtistList
            artists={filteredArtists}
            heading={`${selectedCategory} - ${selectedGenre.join(
              ", "
            )} - ${selectedLocation} - ${selectedEventType} - ${selectedLanguage.join(
              ", "
            )} - ${selectedInstrument.join(
              ", "
            )} - ${selectedMinBudget} to ${selectedMaxBudget}`}
          />
        ) : (
          <p>No artists found.</p>
        )}
      </div>
    </ThemeProvider>
  );
}

export default Search;
