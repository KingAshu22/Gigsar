import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import useAuth from "@/lib/hook";
import Modal from "./Modal";
import eventTypesOptions from "@/constants/eventTypes";
import SingleSearch from "./SingleSearch";
import { formatToIndianNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import * as animationData from "../../public/cat.json";
import LottieImg from "./Lottie";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Pagination from "./Pagination";
import SignIn from "../(route)/(auth)/sign-in/page";

function ArtistList({
  artists,
  selectedCategory,
  selectedGenre,
  selectedEventType = "All Event Types",
  selectedDate,
  selectedLanguage,
  selectedInstrument,
  selectedGender,
  selectedMinBudget,
  selectedMaxBudget,
  budget,
  page,
  setPage,
  totalPages,
  showEnquiry = true,
  showBooking = false,
  name,
  bookLocation,
}) {
  const router = useRouter();
  const inputRef = useRef(null);
  const isAuthenticated = useAuth();
  const [contact, setContact] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState(selectedDate); // New state for event date
  const [location, setLocation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [currentArtistId, setCurrentArtistId] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(""); // New state for current artist budget
  const [showLogin, setShowLogin] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const storedContact = localStorage?.getItem("mobile");

    if (storedContact) {
      setContact(`+${storedContact}`);
      getClient();
    }
  }, []);

  const getClient = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/client/contact/+${localStorage?.getItem(
          "mobile"
        )}`
      );

      if (response.data) {
        setClient(response.data);
      }
    } catch (error) {
      console.error("Error fetching Client:", error);
    }
  };

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
            setIsValid(true);
          }
        });
      };

      if (typeof google !== "undefined" && google.maps) {
        initAutocomplete();
      }
    }
  }, [location]);

  useEffect(() => {
    if (selectedEventType !== "All Event Types") {
      setEventType(selectedEventType);
    }
  }, [selectedEventType]);

  const formatString = (str) => {
    return str
      .split("-") // Split by hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" ") // Join words with a space
      .trim(); // Ensure no extra spaces
  };

  const sendEnquiry = async (linkid, budget) => {
    if (!linkid) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/client-message`,
        {
          linkid,
          contact,
          selectedGenre,
          selectedLocation: location,
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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const sendExcelEnquiry = async (linkid, budget) => {
    try {
      const params = {
        name: client?.name || "Not Registered User",
        email: client?.email || "gigsar",
        contact: contact,
        location,
        eventType,
        artistType: linkid,
        date: eventDate.toLocaleString(),
        budget,
        message: "Gigsar Enquiry",
      };
      console.log(params);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/gigsar-enquiry`,
        params
      );
      console.log("Enquiry sent successfully:", response.data);
    } catch (err) {
      console.error("Error sending enquiry:", err);
    }
  };

  const handleEventTypeSelect = (item) => {
    setEventType(item);
    setStep(2);
  };

  const handlePreviousStep = () => {
    if (step === 5) {
      setStep(3);
    } else {
      setStep(step - 1);
    }
  };

  const handleSendEnquiryClick = (artist) => {
    setCurrentArtistId(artist.linkid);

    setCurrentBudget(
      budget && artist[budget]
        ? Number(artist[budget]).toLocaleString("en-IN")
        : Number(artist.price).toLocaleString("en-IN")
    );

    console.log(eventDate);
    console.log(selectedDate);

    const isEventTypeDefault =
      eventType === "" || eventType === "All Event Types";

    console.log("isEventTypeDefault: " + isEventTypeDefault);

    if (isEventTypeDefault) {
      setStep(1);
      setShowModal(true);
    } else if (!selectedDate || selectedDate === "Not selected") {
      setStep(2);
      setShowModal(true);
    } else if (location !== "") {
      setStep(3);
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (step === 4) {
      const intervalId = setInterval(() => {
        const mobile = localStorage.getItem("mobile");
        if (mobile && mobile.length > 0) {
          setStep(5);
        }
      }, 200); // Check every 200 ms

      // Cleanup the interval on component unmount or when step changes
      return () => clearInterval(intervalId);
    }
  }, [step]);

  const handleModalClose = () => {
    setShowModal(false);
    setEventDate(); // Reset event date
    setStep(1);
    setCurrentArtistId(null);
    setCurrentBudget(""); // Reset current budget
  };

  useEffect(() => {
    if (step === 5) {
      sendExcelEnquiry(currentArtistId, currentBudget);
      const rzpPaymentForm = document.getElementById("rzp_payment_form");

      if (!rzpPaymentForm?.hasChildNodes()) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.async = true;
        script.dataset.payment_button_id = "pl_PAW3XEg9owspeG";
        rzpPaymentForm.appendChild(script);
      }
    }
  }, [step]);

  return (
    <div className="mb-10 px-8">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
        strategy="afterInteractive" // Load after the page is interactive
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
                setIsValid(true);
              }
            });
          }
        }}
      />
      <Modal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
        }}
        title="Login Required"
        description="You need to be logged in to send enquiries."
      >
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.push("/user-dashboard")}>
            Login Now
          </Button>
        </div>
      </Modal>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-4 lg:grid-cols-4">
        {artists?.length > 0 ? (
          artists.map((artist, index) => {
            const eventTypeLink =
              eventType.length > 0 ? `?selectedEventType=${eventType}` : "";
            return (
              <div
                className="border-[1px] rounded-lg p-3 cursor-pointer hover:border-primary hover:shadow-sm transition-all ease-in-out"
                key={index}
              >
                <Link href={`/artist/${artist.linkid}${eventTypeLink}`}>
                  <img
                    src={artist.profilePic}
                    alt={artist.name}
                    width={350}
                    height={350}
                    loading="lazy"
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
                  {showEnquiry && (
                    <button
                      onClick={() => handleSendEnquiryClick(artist)}
                      className="p-2 px-3 border-[1px] border-primary text-primary rounded-full w-full text-center text-[11px] mt-2 cursor-pointer hover:bg-primary hover:text-white"
                    >
                      Send enquiry
                    </button>
                  )}
                  {showBooking && (
                    <Link
                      className="w-full"
                      href={`/book/${artist.linkid}?name=${name}&event=${selectedEventType}&location=${bookLocation}&date=${selectedDate}`}
                    >
                      <button className="p-2 px-3 border-[1px] border-primary text-primary rounded-full w-full text-center text-[14px] mt-2 cursor-pointer hover:bg-primary hover:text-white">
                        Book Now
                      </button>
                    </Link>
                  )}
                  {showModal && currentArtistId === artist.linkid && (
                    <Modal
                      isOpen={showModal}
                      onClose={handleModalClose}
                      title={
                        step === 1
                          ? "Select Event Type"
                          : step === 2
                          ? "Select Event Date"
                          : step === 3
                          ? "Select Event City"
                          : step === 4
                          ? "Mobile Number"
                          : "Confirm Enquiry"
                      }
                    >
                      <div className="flex flex-col items-center">
                        {step === 1 && (
                          <SingleSearch
                            type=""
                            list={artist.eventsType.split(", ")}
                            topList={artist.eventsType.split(", ")}
                            selectedItem={eventType}
                            setSelectedItem={handleEventTypeSelect}
                            showSearch={false}
                          />
                        )}
                        {step === 2 && (
                          <Calendar
                            mode="single"
                            selected={eventDate}
                            onSelect={(date) => setEventDate(date)}
                            className="border border-gray-300 rounded-md p-2"
                            initialFocus
                          />
                        )}
                        {step === 3 && (
                          <input
                            type="text"
                            id="xabx"
                            value={location}
                            autoComplete="new-password"
                            ref={inputRef}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        )}
                        {step === 4 && (
                          <>
                            <SignIn isModal={true} />
                          </>
                        )}
                        {step === 5 && (
                          <div className="flex flex-col items-start p-4 bg-white shadow-lg rounded-lg">
                            <p className="font-bold text-lg mb-4 text-gray-800">
                              {Number(currentBudget.replace(/,/g, "")) > 1000000
                                ? "Premium Enquiry"
                                : "Confirm your Enquiry"}
                            </p>
                            <div className="mb-4">
                              <p className="text-gray-700">
                                <strong>Event Type:</strong> {eventType}
                              </p>
                              <p className="text-gray-700">
                                <strong>Event Date:</strong>{" "}
                                {eventDate || selectedDate
                                  ? (
                                      eventDate || selectedDate
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "Not selected"}
                              </p>
                              <p className="text-gray-700">
                                <strong>Location:</strong> {location}
                              </p>
                            </div>

                            {Number(currentBudget.replace(/,/g, "")) >
                              1000000 && (
                              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-gray-800 font-medium mb-2">
                                  To ensure the best experience and prioritize
                                  genuine enquiries & reduce SPAM enquiries, a
                                  small, non-refundable fee of{" "}
                                  <strong>₹99</strong> is required when
                                  submitting your request. This guarantees that
                                  only genuine clients are connected with our
                                  celebrity artists and our Dedicated Artist
                                  Manager will call you to assist you for the
                                  enquiry.
                                </p>
                              </div>
                            )}
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
                          {step === 2 && (
                            <button
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => setStep(3)}
                            >
                              Next
                            </button>
                          )}
                          {isValid && step === 3 && (
                            <button
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => {
                                if (!isAuthenticated) {
                                  setStep(4);
                                } else {
                                  setStep(5);
                                }
                              }}
                            >
                              Next
                            </button>
                          )}
                          {step === 5 &&
                            (Number(currentBudget.replace(/,/g, "")) >
                            1000000 ? (
                              <form id="rzp_payment_form"></form>
                            ) : (
                              <button
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => {
                                  toast.promise(
                                    sendEnquiry(currentArtistId, currentBudget),
                                    {
                                      loading: "Sending Enquiry...",
                                      success: "Enquiry Sent Successfully",
                                      error:
                                        "Error sending Enquiry, Please try again later",
                                    },
                                    {
                                      style: {
                                        width: "full",
                                      },
                                    }
                                  );
                                  handleModalClose();
                                }}
                              >
                                Confirm & Send
                              </button>
                            ))}
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
            {showEnquiry ? (
              <>
                <LottieImg
                  animationData={animationData}
                  width={300}
                  height={300}
                />
                <p className="text-lg font-bold mt-4">No artists found.</p>
              </>
            ) : (
              <p className="text-lg font-bold mt-4">No artists.</p>
            )}
          </div>
        )}
      </div>
      {showEnquiry && (
        <>
          <Pagination
            className="mt-6"
            totalPages={totalPages} // Total number of pages
            currentPage={page} // Current active page
            setPage={(newPage) => {
              setPage(newPage);
            }}
          />
          <div className="py-4" />
        </>
      )}
    </div>
  );
}

export default ArtistList;
