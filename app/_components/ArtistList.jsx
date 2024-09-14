import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/lib/hook";
import Modal from "./Modal";
import eventTypesOptions from "@/constants/eventTypes";
import SingleSearch from "./SingleSearch";
import artistTypesOptions from "@/constants/artistTypes";
import { formatToIndianNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import * as animationData from "../../public/cat.json";
import LottieImg from "./Lottie";

function ArtistList({
  artists,
  selectedCategory,
  selectedGenre,
  selectedLocation,
  selectedEventType,
  selectedLanguage,
  selectedInstrument,
  selectedGender,
  selectedMinBudget,
  selectedMaxBudget,
  budget,
}) {
  const { toast } = useToast();
  const isAuthenticated = useAuth();
  const [contact, setContact] = useState("");
  const [artistType, setArtistType] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState(null); // New state for event date
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [currentArtistId, setCurrentArtistId] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(""); // New state for current artist budget

  useEffect(() => {
    const storedContact = localStorage.getItem("mobile");
    if (storedContact) {
      setContact(`+${storedContact}`);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory !== "All Artist Types") {
      setArtistType(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedEventType !== "All Event Types") {
      setEventType(selectedEventType);
    }
  }, [selectedEventType]);

  const sendEnquiry = async (linkid, budget) => {
    if (!linkid) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/client-message`,
        {
          linkid,
          contact,
          selectedCategory: artistType,
          selectedGenre,
          selectedLocation,
          selectedEventType: eventType,
          selectedDate: eventDate
            ? eventDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "", // Format date as "18 Aug 2024"
          selectedLanguage,
          selectedInstrument,
          selectedGender,
          budget,
          selectedMinBudget,
          selectedMaxBudget,
        },
        { withCredentials: true }
      );
      toast({
        description: "Enquiry sent successfully.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error sending message");
    }
  };

  const handleArtistTypeSelect = (item) => {
    setArtistType(item);
    setStep(2);
  };

  const handleEventTypeSelect = (item) => {
    setEventType(item);
    setStep(3);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSendEnquiryClick = (artist) => {
    setCurrentArtistId(artist.linkid);
    setCurrentBudget(
      budget && artist[budget]
        ? formatToIndianNumber(artist[budget])
        : formatToIndianNumber(artist.price)
    );

    if (!isAuthenticated) {
      toast({
        description: "Please Sign In before sending enquiry.",
      });
      return;
    }

    const isArtistTypeDefault =
      artistType === "" || artistType === "All Artist Types";
    const isEventTypeDefault =
      eventType === "" || eventType === "All Event Types";

    if (isArtistTypeDefault) {
      setStep(1);
      setShowModal(true);
    } else if (isEventTypeDefault) {
      setStep(2);
      setShowModal(true);
    } else {
      setStep(3);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setArtistType("");
    setEventDate(null); // Reset event date
    setStep(1);
    setCurrentArtistId(null);
    setCurrentBudget(""); // Reset current budget
  };

  return (
    <div className="mb-10 px-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-4 lg:grid-cols-4">
        {artists.length > 0 ? (
          artists.map((artist, index) => {
            const eventTypeLink =
              eventType.length > 0 ? `?selectedEventType=${eventType}` : "";
            return (
              <div
                className="border-[1px] rounded-lg p-3 cursor-pointer hover:border-primary hover:shadow-sm transition-all ease-in-out"
                key={index}
              >
                <Link href={`/artist/${artist.linkid}${eventTypeLink}`}>
                  <Image
                    src={artist.profilePic}
                    alt={artist.name}
                    width={350}
                    height={350}
                    className="object-cover rounded-lg"
                  />
                </Link>
                <div className="mt-3 items-baseline flex flex-col gap-1">
                  <h2 className="text-[10px] bg-blue-100 p-1 rounded-full px-2 text-primary">
                    {artist.artistType}
                  </h2>
                  <h2 className="font-bold">{artist.name}</h2>
                  <h2 className="text-primary text-sm">
                    ₹{" "}
                    {budget && artist[budget]
                      ? formatToIndianNumber(artist[budget])
                      : formatToIndianNumber(artist.price)}
                  </h2>
                  <h2 className="text-gray-500 text-sm">{artist.location}</h2>
                  <button
                    onClick={() => handleSendEnquiryClick(artist)}
                    className="p-2 px-3 border-[1px] border-primary text-primary rounded-full w-full text-center text-[11px] mt-2 cursor-pointer hover:bg-primary hover:text-white"
                  >
                    Send enquiry
                  </button>
                  {showModal && currentArtistId === artist.linkid && (
                    <Modal
                      isOpen={showModal}
                      onClose={handleModalClose}
                      title={
                        step === 1
                          ? "Select Artist Type"
                          : step === 2
                          ? "Select Event Type"
                          : step === 3
                          ? "Select Event Date"
                          : "Confirm Enquiry"
                      }
                    >
                      <div className="flex flex-col items-center">
                        {step === 1 && (
                          <SingleSearch
                            type="Artist Type"
                            list={artistTypesOptions}
                            topList={artistTypesOptions}
                            selectedItem={artistType}
                            setSelectedItem={handleArtistTypeSelect}
                            showSearch={true}
                          />
                        )}
                        {step === 2 && (
                          <SingleSearch
                            type="Event Type"
                            list={eventTypesOptions}
                            topList={eventTypesOptions}
                            selectedItem={eventType}
                            setSelectedItem={handleEventTypeSelect}
                            showSearch={true}
                          />
                        )}
                        {step === 3 && (
                          <>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Select Event Date
                            </label>
                            <Calendar
                              mode="single"
                              selected={eventDate}
                              onSelect={(date) => setEventDate(date)}
                              className="border border-gray-300 rounded-md p-2"
                              initialFocus
                            />
                          </>
                        )}
                        {step === 4 && (
                          <div className="flex flex-col items-start">
                            <p className="font-bold mb-2">
                              Confirm Your Enquiry
                            </p>
                            <p>
                              <strong>Artist Type:</strong> {artistType}
                            </p>
                            <p>
                              <strong>Event Type:</strong> {eventType}
                            </p>
                            <p>
                              <strong>Event Date:</strong>{" "}
                              {eventDate
                                ? eventDate.toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Not selected"}
                            </p>
                            <p>
                              <strong>Location:</strong> {selectedLocation}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between w-full mt-4">
                          {step > 1 && (
                            <button
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={handlePreviousStep}
                            >
                              Previous
                            </button>
                          )}
                          {step === 3 && (
                            <button
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => setStep(4)}
                            >
                              Next
                            </button>
                          )}
                          {step === 4 && (
                            <button
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => {
                                sendEnquiry(currentArtistId, currentBudget); // Pass currentBudget
                                handleModalClose();
                              }}
                            >
                              Confirm & Send
                            </button>
                          )}
                        </div>
                      </div>
                    </Modal>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="items-center justify-center text-center p-4">
            <LottieImg animationData={animationData} width={300} height={300} />
            <p className="text-lg font-bold mt-4">No artists found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistList;
