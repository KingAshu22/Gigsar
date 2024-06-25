"use client";
import React, { useEffect, useState } from "react";
import "react-cropper-custom/dist/index.css";
import "@/app/_components/modal.css"; // Import CSS
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Modal from "@/app/_components/Modal";
import { HashLoader } from "react-spinners";

const EditArtist = ({ params }) => {
  const [id, setId] = useState();

  const getArtist = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/artist/artistName/` + params.artist
      );
      const artistData = response.data;

      setId(artistData._id);
      setArtistName(artistData.name);

      const weddingLink = artistData.events
        .filter((event) => event.name === "Wedding Videos") // Filter events with name "Wedding Videos"
        .map((event) => event.links) // Extract the links array from the event
        .flat(); // Flatten the array (in case there are multiple links, though it seems you only have one per event)

      const corporateLink = artistData.events
        .filter((event) => event.name === "Corporate Videos") // Filter events with name "Wedding Videos"
        .map((event) => event.links) // Extract the links array from the event
        .flat(); // Flatten the array (in case there are multiple links, though it seems you only have one per event)

      const collegeLink = artistData.events
        .filter((event) => event.name === "College Videos") // Filter events with name "Wedding Videos"
        .map((event) => event.links) // Extract the links array from the event
        .flat(); // Flatten the array (in case there are multiple links, though it seems you only have one per event)

      const concertLink = artistData.events
        .filter((event) => event.name === "Ticketing Concert Videos") // Filter events with name "Wedding Videos"
        .map((event) => event.links) // Extract the links array from the event
        .flat(); // Flatten the array (in case there are multiple links, though it seems you only have one per event)

      const originalLink = artistData.events
        .filter((event) => event.name === "Original Videos") // Filter events with name "Wedding Videos"
        .map((event) => event.links) // Extract the links array from the event
        .flat(); // Flatten the array (in case there are multiple links, though it seems you only have one per event)

      const bollywoodLink = artistData.events
        .filter((event) => event.name === "Bollywood Playback Videos") // Filter events with name "Wedding Videos"
        .map((event) => event.links) // Extract the links array from the event
        .flat(); // Flatten the array (in case there are multiple links, though it seems you only have one per event)

      const coverLink = artistData.events
        .filter((event) => event.name === "Cover Videos") // Filter events with name "Wedding Videos"
        .map((event) => event.links) // Extract the links array from the event
        .flat(); // Flatten the array (in case there are multiple links, though it seems you only have one per event)

      setWeddingLink(weddingLink);
      setCorporateLink(corporateLink);
      setCollegeLink(collegeLink);
      setConcertLink(concertLink);
      setOriginalLink(originalLink);
      setBollywoodLink(bollywoodLink);
      setCoverLink(coverLink);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      // Reset loading state
      setTimeout(() => {
        setFetchData(false);
      }, 1000);
    }
  };

  const [artistName, setArtistName] = useState();
  const [weddingLink, setWeddingLink] = useState([""]);
  const [corporateLink, setCorporateLink] = useState([""]);
  const [collegeLink, setCollegeLink] = useState([""]);
  const [concertLink, setConcertLink] = useState([""]);
  const [originalLink, setOriginalLink] = useState([""]);
  const [bollywoodLink, setBollywoodLink] = useState([""]);
  const [coverLink, setCoverLink] = useState([""]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fetchData, setFetchData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getArtist();
  }, []);

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
        weddingLink,
        corporateLink,
        collegeLink,
        concertLink,
        originalLink,
        bollywoodLink,
        coverLink,
      };

      const response = axios.post(
        `${process.env.NEXT_PUBLIC_API}/edit-event-videos/${id}`,
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
    <>
      {fetchData ? (
        <div className="container mx-auto py-10">
          <div className="flex justify-center items-center p-10">
            <HashLoader color="#dc2626" size={80} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-5">
          <h1 className="text-xl font-bold mb-4">Event Videos</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div>
                <label
                  htmlFor="youtubeLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Wedding/Private Event Videos Youtube Link:
                </label>
                {weddingLink.map((link, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      id={`youtubeLink-${index}`}
                      value={link}
                      autoComplete="off"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleWeddingChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button type="button" className="" onClick={addMoreWedding}>
                Add Link
              </Button>
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="youtubeLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Corporate Event Videos Youtube Link:
                </label>
                {corporateLink.map((link, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      autoComplete="off"
                      id={`youtubeLink-${index}`}
                      value={link}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleCorporateChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button type="button" className="" onClick={addMoreCorporate}>
                Add Link
              </Button>
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="youtubeLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  College Event Videos Youtube Link:
                </label>
                {collegeLink.map((link, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      autoComplete="off"
                      id={`youtubeLink-${index}`}
                      value={link}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleCollegeChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button type="button" className="" onClick={addMoreCollege}>
                Add Link
              </Button>
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="youtubeLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ticketing Concert Videos Youtube Link:
                </label>
                {concertLink.map((link, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      autoComplete="off"
                      id={`youtubeLink-${index}`}
                      value={link}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleConcertChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button type="button" className="" onClick={addMoreConcert}>
                Add Link
              </Button>
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="youtubeLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Original Videos Youtube Link:
                </label>
                {originalLink.map((link, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      autoComplete="off"
                      id={`youtubeLink-${index}`}
                      value={link}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleOriginalChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button type="button" className="" onClick={addMoreOriginal}>
                Add Link
              </Button>
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="youtubeLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bollywood Playback Videos Youtube Link:
                </label>
                {bollywoodLink.map((link, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      autoComplete="off"
                      id={`youtubeLink-${index}`}
                      value={link}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleBollywoodChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button type="button" className="" onClick={addMoreBollywood}>
                Add Link
              </Button>
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="youtubeLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cover Videos Youtube Link:
                </label>
                {coverLink.map((link, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      autoComplete="off"
                      id={`youtubeLink-${index}`}
                      value={link}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => handleCoverChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <Button type="button" className="" onClick={addMoreCover}>
                Add Link
              </Button>
            </div>

            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update
            </button>
          </form>
          {/* Confirmation modal */}
          <Modal
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            title="Are you sure you want to Submit?"
            description={`This will update Event Videos for ${artistName}`}
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
                Update
              </button>
            </div>
          </Modal>

          <Modal isOpen={isLoading} title="Updating Event Videos...">
            <div className="flex justify-center items-center">
              <HashLoader color="#dc2626" size={80} />
            </div>
          </Modal>

          {error && <p className="error">{error}</p>}
          <Modal
            isOpen={success}
            onClose={() => setSuccess(false)}
            title="Event Videos Updated"
            description={`${artistName}'s Event Videos has been successfully updated.`}
          >
            <div className="flex justify-center">
              <button
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="button"
                onClick={() => router.push("/artist-dashboard")}
              >
                Dashboard
              </button>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default EditArtist;
