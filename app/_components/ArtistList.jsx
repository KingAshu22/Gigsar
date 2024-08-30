import { formatToIndianNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/lib/hook";
import Modal from "./Modal";
import eventTypesOptions from "@/constants/eventTypes";
import SingleSearch from "./SingleSearch";
import artistTypesOptions from "@/constants/artistTypes";

function ArtistList({
  artists,
  selectedCategory,
  selectedGenre,
  selectedLocation,
  selectedEventType,
  selectedDate,
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
  const [artistType, setArtistType] = useState(
    selectedCategory !== "All Artist Types" ? selectedCategory : ""
  );
  const [eventType, setEventType] = useState(
    selectedEventType !== "All Event Types" ? selectedEventType : ""
  );
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  useEffect(() => {
    const storedContact = localStorage.getItem("mobile");
    if (storedContact) {
      setContact(`+${storedContact}`);
    }
  }, []);

  const sendEnquiry = async () => {
    if (!selectedArtistId) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/client-message`,
        {
          linkid: selectedArtistId,
          contact,
          selectedCategory: artistType,
          selectedGenre,
          selectedLocation,
          selectedEventType: eventType,
          selectedDate,
          selectedLanguage,
          selectedInstrument,
          selectedGender,
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

  const handleSendEnquiryClick = (linkid) => {
    setSelectedArtistId(linkid);

    if (!artistType || !eventType) {
      setShowModal(true);
    } else if (isAuthenticated) {
      setStep(3);
      setShowModal(true);
    } else {
      toast({
        description: "Please Sign In before sending enquiry.",
      });
    }
  };

  return (
    <div className="mb-10 px-8">
      <div
        className="grid grid-cols-2 
        sm:grid-cols-2 md:grid-cols-3
        gap-7 mt-4
         lg:grid-cols-4"
      >
        {artists.length > 0
          ? artists.map((artist, index) => {
              const eventTypeLink =
                eventType.length > 0 ? `?selectedEventType=${eventType}` : "";
              return (
                <div
                  className="border-[1px] rounded-lg p-3
                  cursor-pointer hover:border-primary
                  hover:shadow-sm transition-all ease-in-out"
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
                    <h2
                      className="text-[10px] bg-blue-100 p-1 rounded-full
                        px-2 text-primary"
                    >
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
                      onClick={() => handleSendEnquiryClick(artist.linkid)}
                      className="p-2 px-3 border-[1px] border-primary
                        text-primary rounded-full w-full text-center
                        text-[11px] mt-2
                        cursor-pointer 
                        hover:bg-primary hover:text-white"
                    >
                      Send enquiry
                    </button>
                  </div>
                </div>
              );
            })
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                className="h-[220px] bg-slate-200 
              w-full rounded-lg animate-pulse"
                key={index}
              ></div>
            ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={
            step === 1
              ? "Select Artist Type"
              : step === 2
              ? "Select Event Type"
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
              <p>
                Are you sure you want to send the enquiry to {selectedArtistId}?
              </p>
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
                  onClick={() => {
                    sendEnquiry();
                    setShowModal(false);
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
  );
}

export default ArtistList;
