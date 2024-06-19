"use client";
import React, { useEffect, useRef, useState } from "react";
import "react-cropper-custom/dist/index.css";
import "./modal.css"; // Import CSS for modal styles
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import eventTypesOptions from "./constants/eventTypes";
import genreOptions from "./constants/genres";
import instrumentOptions from "./constants/instruments";
import languageOptions from "./constants/languages";
import { Button } from "@/components/ui/button";
import PhotoUploader from "@/app/_components/PhotoUploader";
import { useRouter } from "next/navigation";
import Modal from "@/app/_components/Modal";
import { HashLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import SearchList from "@/app/_components/SearchList";
import { topGenres } from "./constants/topGenres";
import topInstruments from "./constants/topInstruments";

const ArtistRegistration = () => {
  const { user } = useUser();

  const inputRef = useRef(null);

  const [artistName, setArtistName] = useState();
  const [profilePic, setProfilePic] = useState("");
  const [galleryLink, setGalleryLink] = useState([]);
  const [weddingLink, setWeddingLink] = useState([""]);
  const [corporateLink, setCorporateLink] = useState([""]);
  const [collegeLink, setCollegeLink] = useState([""]);
  const [concertLink, setConcertLink] = useState([""]);
  const [originalLink, setOriginalLink] = useState([""]);
  const [bollywoodLink, setBollywoodLink] = useState([""]);
  const [coverLink, setCoverLink] = useState([""]);
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [artistType, setArtistType] = useState("");
  const [eventTypes, setEventTypes] = useState([]);
  const [corporateBudget, setCorporateBudget] = useState("");
  const [collegeBudget, setCollegeBudget] = useState("");
  const [weddingBudget, setWeddingBudget] = useState("");
  const [singerCumGuitaristBudget, setSingerCumGuitaristBudget] = useState("");
  const [singerPlusGuitaristBudget, setSingerPlusGuitaristBudget] =
    useState("");
  const [ticketingConcertBudget, setTicketingConcertBudget] = useState("");
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [originalSongName, setOriginalSongName] = useState("");
  const [performanceTime, setPerformanceTime] = useState("");
  const [instruments, setInstruments] = useState([]);
  const [awards, setAwards] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [musicTraining, setMusicTraining] = useState("");
  const [aboutArtist, setAboutArtist] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      user &&
      user.fullName &&
      user.phoneNumbers[0].phoneNumber &&
      user.emailAddresses[0].emailAddress
    ) {
      setArtistName(user.fullName);
      setContactNumber(user.phoneNumbers[0].phoneNumber);
      setEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  useEffect(() => {
    if (inputRef.current) {
      const initAutocomplete = () => {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["(cities)"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setLocation(place.formatted_address);
          }
        });
      };

      if (typeof google !== "undefined" && google.maps) {
        initAutocomplete();
      }
    }
  }, [location]);

  const formatArtistName = (name) => {
    return name.toLowerCase().replace(/ /g, "-");
  };

  const handleEventTypeChange = (event) => {
    const selectedEventType = event.target.value;
    if (event.target.checked) {
      setEventTypes([...eventTypes, selectedEventType]);
    } else {
      setEventTypes(eventTypes.filter((type) => type !== selectedEventType));
    }
  };
  const handleGenreChange = (event) => {
    const selectedGenre = event.target.value;
    if (event.target.checked) {
      setGenres([...genres, selectedGenre]);
    } else {
      setGenres(genres.filter((type) => type !== selectedGenre));
    }
  };
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    if (event.target.checked) {
      setLanguages([...languages, selectedLanguage]);
    } else {
      setLanguages(languages.filter((type) => type !== selectedLanguage));
    }
  };
  const handleInstrumentChange = (event) => {
    const selectedInstrument = event.target.value;
    if (event.target.checked) {
      setInstruments([...instruments, selectedInstrument]);
    } else {
      setInstruments(instruments.filter((type) => type !== selectedInstrument));
    }
  };

  const handleGalleryUpload = (link) => {
    setGalleryLink((prevLinks) => [...prevLinks, link]);
  };

  // Function to add more input fields
  const addMoreWedding = () => {
    setWeddingLink((prevLinks) => [...prevLinks, ""]);
  };

  const addMoreCorporate = () => {
    setCorporateLink((prevLinks) => [...prevLinks, ""]);
  };

  const addMoreCollege = () => {
    setCollegeLink((prevLinks) => [...prevLinks, ""]);
  };

  const addMoreConcert = () => {
    setConcertLink((prevLinks) => [...prevLinks, ""]);
  };

  const addMoreOriginal = () => {
    setOriginalLink((prevLinks) => [...prevLinks, ""]);
  };

  const addMoreBollywood = () => {
    setBollywoodLink((prevLinks) => [...prevLinks, ""]);
  };

  const addMoreCover = () => {
    setCoverLink((prevLinks) => [...prevLinks, ""]);
  };

  // Function to extract video ID from YouTube link
  const extractVideoId = (link) => {
    // Regular expression to match YouTube video ID
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  // Function to handle input change
  const handleWeddingChange = (index, value) => {
    const videoId = extractVideoId(value);
    if (videoId) {
      const updatedLinks = [...weddingLink];
      updatedLinks[index] = videoId;
      setWeddingLink(updatedLinks);
    } else {
      // Handle invalid link or show an error message
      // For now, let's set an empty string
      const updatedLinks = [...weddingLink];
      updatedLinks[index] = "";
      setWeddingLink(updatedLinks);
    }
  };

  const handleCorporateChange = (index, value) => {
    const videoId = extractVideoId(value);
    if (videoId) {
      const updatedLinks = [...corporateLink];
      updatedLinks[index] = videoId;
      setCorporateLink(updatedLinks);
    } else {
      // Handle invalid link or show an error message
      // For now, let's set an empty string
      const updatedLinks = [...corporateLink];
      updatedLinks[index] = "";
      setCorporateLink(updatedLinks);
    }
  };

  const handleCollegeChange = (index, value) => {
    const videoId = extractVideoId(value);
    if (videoId) {
      const updatedLinks = [...collegeLink];
      updatedLinks[index] = videoId;
      setCollegeLink(updatedLinks);
    } else {
      // Handle invalid link or show an error message
      // For now, let's set an empty string
      const updatedLinks = [...collegeLink];
      updatedLinks[index] = "";
      setCollegeLink(updatedLinks);
    }
  };

  const handleConcertChange = (index, value) => {
    const videoId = extractVideoId(value);
    if (videoId) {
      const updatedLinks = [...concertLink];
      updatedLinks[index] = videoId;
      setConcertLink(updatedLinks);
    } else {
      // Handle invalid link or show an error message
      // For now, let's set an empty string
      const updatedLinks = [...concertLink];
      updatedLinks[index] = "";
      setConcertLink(updatedLinks);
    }
  };

  const handleOriginalChange = (index, value) => {
    const videoId = extractVideoId(value);
    if (videoId) {
      const updatedLinks = [...originalLink];
      updatedLinks[index] = videoId;
      setOriginalLink(updatedLinks);
    } else {
      // Handle invalid link or show an error message
      // For now, let's set an empty string
      const updatedLinks = [...originalLink];
      updatedLinks[index] = "";
      setOriginalLink(updatedLinks);
    }
  };

  const handleBollywoodChange = (index, value) => {
    const videoId = extractVideoId(value);
    if (videoId) {
      const updatedLinks = [...bollywoodLink];
      updatedLinks[index] = videoId;
      setBollywoodLink(updatedLinks);
    } else {
      // Handle invalid link or show an error message
      // For now, let's set an empty string
      const updatedLinks = [...bollywoodLink];
      updatedLinks[index] = "";
      setBollywoodLink(updatedLinks);
    }
  };

  const handleCoverChange = (index, value) => {
    const videoId = extractVideoId(value);
    if (videoId) {
      const updatedLinks = [...coverLink];
      updatedLinks[index] = videoId;
      setCoverLink(updatedLinks);
    } else {
      // Handle invalid link or show an error message
      // For now, let's set an empty string
      const updatedLinks = [...coverLink];
      updatedLinks[index] = "";
      setCoverLink(updatedLinks);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
    setError(null);
    setSuccess(false);
  };

  const handleConfirmSubmit = async () => {
    try {
      setShowConfirmationModal(false);
      setIsLoading(true);
      // Handle the submission of form data
      const formData = {
        artistName,
        profilePic,
        galleryLink,
        weddingLink,
        corporateLink,
        collegeLink,
        concertLink,
        originalLink,
        bollywoodLink,
        coverLink,
        gender,
        contactNumber,
        email,
        location,
        artistType,
        eventTypes,
        corporateBudget,
        collegeBudget,
        weddingBudget,
        singerCumGuitaristBudget,
        singerPlusGuitaristBudget,
        ticketingConcertBudget,
        genres,
        originalSongName,
        performanceTime,
        instruments,
        awards,
        instagramLink,
        facebookLink,
        youtubeLink,
        spotifyLink,
        musicTraining,
        aboutArtist,
        showGigsar: false,
        showBookMySinger: false,
      };

      const response = axios.post(
        `${process.env.NEXT_PUBLIC_API}/artist-registration`,
        formData,
        { withCredentials: true }
      );
    } catch (error) {
      // Handle error
      console.error("Error submitting form:", error);
      setError(error.message || "An error occurred during submission.");
    } finally {
      // Reset loading state
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => {
          if (inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(
              inputRef.current,
              {
                types: ["(cities)"],
              }
            );

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (place.geometry) {
                setLocation(place.formatted_address);
              }
            });
          }
        }}
      />
      <h1 className="text-xl font-bold mb-4">Artist Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="artistName"
            className="block text-sm font-medium text-gray-700"
          >
            Artist Name
          </label>
          <input
            type="text"
            id="artistName"
            value={artistName}
            required
            readOnly
            onChange={(e) => setArtistName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Profile Pic
        </label>
        <PhotoUploader artistName={artistName} setProfilePic={setProfilePic} />

        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number
          </label>
          <input
            type="text"
            id="contactNumber"
            value={contactNumber}
            readOnly
            onChange={(e) => setContactNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            readOnly
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="location"
            value={location}
            autoComplete="off"
            ref={inputRef}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="artistType"
            className="block text-sm font-medium text-gray-700"
          >
            Artist Type
          </label>
          <select
            id="artistType"
            value={artistType}
            onChange={(e) => setArtistType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Artist Type</option>
            <option value="singer-band">Singer/Live Band</option>
            <option value="musician">Musician</option>
            <option value="dj">DJ</option>
            <option value="comedian">Comedian</option>
            <option value="actor">Actor</option>
            <option value="magician">Magician</option>
            <option value="dancer">Dancer</option>
            <option value="anchor">Anchor</option>
            <option value="foreign-artist">Foreign Artist</option>
            <option value="event-manager">Event Manager</option>
            <option value="wedding-planner">Wedding Planner</option>
            <option value="artist-manager">Artist Manager</option>
            <option value="rapper">Rapper</option>
            <option value="voice-over-artist">Voice over Artist</option>
            <option value="session-artist">Session Artist (Musician)</option>
            <option value="music-composer">Music Composer</option>
            <option value="lyricist">Lyricist</option>
            <option value="master-mixing-engineer">
              Master Mixing Engineer
            </option>
          </select>
        </div>

        {/* Gallery Image Uploaders */}
        <div className="mb-4">
          <p className="text-sm">Gallery Images</p>
          <div className="gallery-uploader-container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <label
                  htmlFor={`galleryImage${index + 1}`}
                  className="block text-sm font-medium text-gray-700 text-center"
                >
                  Image {index + 1}
                </label>
                <PhotoUploader
                  id={`galleryImage${index + 1}`}
                  artistName={artistName}
                  setProfilePic={handleGalleryUpload}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              Wedding/Private Event Videos{" "}
              <span className="text-gray-500">(Youtube Link)</span>:
            </label>
            {weddingLink.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleWeddingChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-gray-500 mt-4"
            onClick={addMoreWedding}
          >
            Add More Link
          </Button>
        </div>

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              Corporate Event Videos{" "}
              <span className="text-gray-500">(Youtube Link)</span>:
            </label>
            {corporateLink.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleCorporateChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-gray-500 mt-4"
            onClick={addMoreCorporate}
          >
            Add More Link
          </Button>
        </div>

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              College Event Videos{" "}
              <span className="text-gray-500">(Youtube Link)</span>:
            </label>
            {collegeLink.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleCollegeChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-gray-500 mt-4"
            onClick={addMoreCollege}
          >
            Add More Link
          </Button>
        </div>

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              Ticketing Concert Videos{" "}
              <span className="text-gray-500">(Youtube Link)</span>:
            </label>
            {concertLink.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleConcertChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-gray-500 mt-4"
            onClick={addMoreConcert}
          >
            Add More Link
          </Button>
        </div>

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              Original Videos{" "}
              <span className="text-gray-500">(Youtube Link)</span>:
            </label>
            {originalLink.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleOriginalChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-gray-500 mt-4"
            onClick={addMoreOriginal}
          >
            Add More Link
          </Button>
        </div>

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              Bollywood Playback Videos{" "}
              <span className="text-gray-500">(Youtube Link)</span>:
            </label>
            {bollywoodLink.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleBollywoodChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-gray-500 mt-4"
            onClick={addMoreBollywood}
          >
            Add More Link
          </Button>
        </div>

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              Cover Videos <span className="text-gray-500">(Youtube Link)</span>
              :
            </label>
            {coverLink.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleCoverChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="bg-gray-500 mt-4"
            onClick={addMoreCover}
          >
            Add More Link
          </Button>
        </div>

        <SearchList
          type="Event Types"
          list={eventTypesOptions}
          topList={eventTypesOptions}
          selectedItems={eventTypes}
          setSelectedItems={setEventTypes}
        />

        {eventTypes.includes("Corporate") && (
          <div className="mb-4">
            <label
              htmlFor="corporateBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Corporate Event Budget
            </label>
            <input
              type="number"
              id="corporateBudget"
              value={corporateBudget}
              step={10000}
              onChange={(e) => setCorporateBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        {eventTypes.includes("College") && (
          <div className="mb-4">
            <label
              htmlFor="collegeBudget"
              className="block text-sm font-medium text-gray-700"
            >
              College Event Budget
            </label>
            <input
              type="number"
              id="collegeBudget"
              value={collegeBudget}
              onChange={(e) => setCollegeBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        {eventTypes.includes("Wedding") && (
          <div className="mb-4">
            <label
              htmlFor="weddingBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Wedding/Private Event Budget
            </label>
            <input
              type="number"
              id="weddingBudget"
              value={weddingBudget}
              onChange={(e) => setWeddingBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        {eventTypes.includes("House Party") && (
          <>
            <div className="mb-4">
              <label
                htmlFor="singerCumGuitaristBudget"
                className="block text-sm font-medium text-gray-700"
              >
                Singer cum Guitarist Budget
              </label>
              <input
                type="number"
                id="singerCumGuitaristBudget"
                value={singerCumGuitaristBudget}
                onChange={(e) => setSingerCumGuitaristBudget(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="singerPlusGuitaristBudget"
                className="block text-sm font-medium text-gray-700"
              >
                Singer + Guitarist Budget
              </label>
              <input
                type="number"
                id="singerPlusGuitaristBudget"
                value={singerPlusGuitaristBudget}
                onChange={(e) => setSingerPlusGuitaristBudget(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </>
        )}

        {eventTypes.includes("Ticketing Concert") && (
          <div className="mb-4">
            <label
              htmlFor="ticketingConcertBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Ticketing Concert Budget
            </label>
            <input
              type="number"
              id="ticketingConcertBudget"
              value={ticketingConcertBudget}
              onChange={(e) => setTicketingConcertBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        <SearchList
          type="Genre"
          list={genreOptions}
          topList={topGenres}
          selectedItems={genres}
          setSelectedItems={setGenres}
        />

        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Language Speaks
          </label>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
            {languageOptions.map((option) => (
              <div key={option}>
                <input
                  type="checkbox"
                  id={option}
                  value={option}
                  onChange={handleLanguageChange}
                  className="mr-2"
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        </div> */}
        <div className="mb-4">
          <label
            htmlFor="originalSong"
            className="block text-sm font-medium text-gray-700"
          >
            Original Songs Name
          </label>
          <input
            type="text"
            id="originalSongs"
            value={originalSongName}
            onChange={(e) => setOriginalSongName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="performanceTime"
            className="block text-sm font-medium text-gray-700"
          >
            Performance Time in Mins
          </label>
          <input
            type="number"
            id="performanceTime"
            value={performanceTime}
            onChange={(e) => setPerformanceTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <SearchList
          type="Instruments"
          list={instrumentOptions}
          topList={topInstruments}
          selectedItems={instruments}
          setSelectedItems={setInstruments}
        />
        <div className="mb-4">
          <label
            htmlFor="performanceTime"
            className="block text-sm font-medium text-gray-700"
          >
            Any Awards/Achievements/Fame
          </label>
          <input
            type="text"
            id="awards"
            value={awards}
            onChange={(e) => setAwards(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="instagramLink"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram Profile Link
          </label>
          <input
            type="text"
            id="instagramLink"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="facebookLink"
            className="block text-sm font-medium text-gray-700"
          >
            Facebook Profile Link
          </label>
          <input
            type="text"
            id="facebookLink"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="youtubeLink"
            className="block text-sm font-medium text-gray-700"
          >
            Youtube Channel Link
          </label>
          <input
            type="text"
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="spotifyLink"
            className="block text-sm font-medium text-gray-700"
          >
            Spotify Profile Link
          </label>
          <input
            type="text"
            id="spotifyLink"
            value={spotifyLink}
            onChange={(e) => setSpotifyLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="musicTraining"
            className="block text-sm font-medium text-gray-700"
          >
            Music Training From
          </label>
          <input
            type="text"
            id="musicTraining"
            value={musicTraining}
            onChange={(e) => setMusicTraining(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="aboutArtist"
            className="block text-sm font-medium text-gray-700"
          >
            Tell Me About Yourself
          </label>
          <Textarea
            id="aboutArtist"
            value={aboutArtist}
            onChange={(e) => setAboutArtist(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      {/* Confirmation modal */}
      <Modal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title="Are you sure you want to submit the form?"
        description={`This will create a profile for ${artistName}`}
      >
        <div className="flex justify-between">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            type="button"
            onClick={() => setShowConfirmationModal(false)}
          >
            Cancel
          </button>
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={handleConfirmSubmit}
          >
            Submit
          </button>
        </div>
      </Modal>

      <Modal isOpen={isLoading} title="Submitting Form...">
        <div className="flex justify-center items-center">
          <HashLoader color="#dc2626" size={80} />
        </div>
      </Modal>

      {error && <p className="error">{error}</p>}
      <Modal
        isOpen={success}
        onClose={() => setSuccess(false)}
        title="Artist Registered"
        description={`${artistName}'s Form has been successfully Registered. Your Form is now in Pending Status. Our Team will verify your details and once everything is correct we will make your page live.`}
      >
        <div className="flex justify-between">
          {/* <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            type="button"
            onClick={() =>
              router.push(`/artist/${formatArtistName(artistName)}`)
            }
          >
            View Page
          </button> */}
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={() => router.push("/artist-dashboard")}
          >
            Home Page
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ArtistRegistration;
