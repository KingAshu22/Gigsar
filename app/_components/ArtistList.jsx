"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import useAuth from "@/lib/hook";
import Modal from "./Modal";
import eventTypesOptions from "@/constants/eventTypes";
import SingleSearch from "./SingleSearch";
import { formatToIndianNumber, getFormattedRange } from "@/lib/utils";
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
import ClientRegistration from "../(route)/user-dashboard/registration/page";
import PayButton from "./PayButton";
import { IndianRupee, MapPin, Music } from "lucide-react";
import SignUp from "../(route)/(auth)/sign-up/page";

function ArtistList({
  artists,
  selectedFilters,
  selectedGenre,
  selectedEventType = "All Event Types",
  selectedDate,
  selectedLanguage,
  selectedInstrument,
  selectedGender,
  selectedMinBudget,
  selectedMaxBudget,
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
  const [budget, setBudget] = useState("");
  const [eventDate, setEventDate] = useState(selectedDate); // New state for event date
  const [location, setLocation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(6);
  const [currentArtistId, setCurrentArtistId] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(""); // New state for current artist budget
  const [showLogin, setShowLogin] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState(null);
  const [enquiryOption, setEnquiryOption] = useState("");

  useEffect(() => {
    const storedContact = localStorage?.getItem("mobile");

    if (storedContact) {
      setContact(`+${storedContact}`);
    }
  }, []);

  const getClient = async () => {
    try {
      console.log("Inside Get Client API");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/client/contact/+${localStorage?.getItem(
          "mobile"
        )}`
      );

      console.log("Client:", response.data);

      if (response.data) {
        setIsLoggedIn(true);
        setClient(response.data);
      }
      return response.data;
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
      if (selectedEventType === "Corporate") {
        setBudget("corporateBudget");
      } else if (selectedEventType === "Wedding") {
        setBudget("price");
      } else if (selectedEventType === "College") {
        setBudget("collegeBudget");
      } else if (selectedEventType === "Ticketing Concert") {
        setBudget("ticketingConcertBudget");
      }
    }
  }, [selectedEventType]);

  const sendExcelEnquiry = async (linkid, budget) => {
    try {
      const params = {
        name: client?.name,
        email: client?.email,
        contact: client?.contact,
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

  const sendDataEnquiry = async () => {
    if (!currentArtistId) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/data-entry`,
        {
          linkid: currentArtistId,
          contact: client.contact,
          selectedLocation: location,
          selectedEventType: eventType,
          selectedDate: eventDate
            ? eventDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "", // Format date as "18 Aug 2024"
          budget: currentBudget,
          paymentDone: false,
        },
        { withCredentials: true }
      );
      setShowModal(false);
      toast.success("Enquiry sent successfully!");
      // router.push(
      //   `/success?&name=${client?.name}&email=${client?.email}&contact=${client?.contact}&linkid=${currentArtistId}&eventType=${eventType}&eventDate=${eventDate}&location=${location}&budget=${budget}&amount=${amount}`
      // );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEventTypeSelect = (item) => {
    setEventType(item);
    setStep(2);
  };

  const handleLocationSelect = (item) => {
    setLocation(item);
    setIsValid(true);
    setStep(4);
  };

  const handlePreviousStep = () => {
    if (step === 6) {
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
    } else if (selectedDate || selectedDate !== "Not selected") {
      setStep(3);
      setShowModal(true);
    } else if (!selectedDate || selectedDate === "Not selected") {
      setStep(2);
      setShowModal(true);
    } else if (location == "") {
      setStep(3);
      setShowModal(true);
    } else if (location.length > 0) {
      console.log("Location is greater");
      setStep(4);
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (step === 4) {
      const intervalId = setInterval(() => {
        const mobile = localStorage.getItem("mobile");
        const authExpiry = localStorage.getItem("authExpiry");
        if (
          mobile &&
          mobile.length > 0 &&
          authExpiry &&
          Date.now() < parseInt(authExpiry, 10)
        ) {
          if (client && client?.name && client?.email) {
            setStep(6);
          } else {
            setStep(5);
          }
        }
      }, 200); // Check every 200 ms

      // Cleanup the interval on component unmount or when step changes
      return () => clearInterval(intervalId);
    }
  }, [step]);

  useEffect(() => {
    if (step === 5) {
      const intervalId = setInterval(() => {
        const mobile = localStorage.getItem("mobile");
        if (mobile && mobile.length > 0) {
          console.log("Trying to fetch Client");
          getClient();
          if (isLoggedIn && client && client?.name && client?.email) {
            console.log("Client fetched successfully");
            setStep(6);
          }
        }
      }, 200); // Check every 200 ms

      // Cleanup the interval on component unmount or when step changes
      return () => clearInterval(intervalId);
    }
  }, [step, isLoggedIn, client]);

  useEffect(() => {
    if (step === 6) {
      sendExcelEnquiry(currentArtistId, currentBudget);
    }
  }, [step]);

  const handleModalClose = () => {
    setShowModal(false);
    setEventType("");
    setEventDate("");
    setLocation("");
    setStep(1);
    setCurrentArtistId(null);
    setCurrentBudget(""); // Reset current budget
  };

  return (
    <div className="mb-10">
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
      <p className="text-xs">Applied Filters:</p>
      <div className="flex flex-wrap gap-2">
        {selectedFilters?.category !== "All Artist Types" && (
          <p className="bg-[#F2F4F8] p-2 rounded-full text-xs text-[#4A5E8B] capitalize">
            {selectedFilters?.category}
          </p>
        )}
        {selectedFilters?.eventType !== "" && (
          <p className="bg-[#F2F4F8] p-2 rounded-full text-xs text-[#4A5E8B] capitalize">
            {selectedFilters?.eventType}
          </p>
        )}
        {selectedFilters?.gender !== "All" && (
          <p className="bg-[#F2F4F8] p-2 rounded-full text-xs text-[#4A5E8B] capitalize">
            {selectedFilters?.gender}
          </p>
        )}
        {selectedFilters?.location !== "All Locations" && (
          <p className="bg-[#F2F4F8] p-2 rounded-full text-xs text-[#4A5E8B] capitalize">
            {selectedFilters?.location}
          </p>
        )}
        {selectedFilters?.genre.length > 0 && (
          <p className="bg-[#F2F4F8] p-2 rounded-full text-xs text-[#4A5E8B] capitalize">
            {selectedFilters?.genre?.join(", ")}
          </p>
        )}
      </div>
      <div className="grid grid-rows-2 sm:grid-rows-2 md:grid-cols-3 gap-2 mt-4 lg:grid-cols-5">
        {artists?.length > 0 ? (
          artists.map((artist, index) => {
            const eventTypeLink =
              eventType.length > 0 ? `?selectedEventType=${eventType}` : "";
            return (
              <>
                <div
                  className="desktop border-[1px] rounded-lg p-3 cursor-pointer hover:border-primary shadow-lg"
                  key={index}
                >
                  <Link href={`/artist/${artist.linkid}?showBooking=true`}>
                    <img
                      src={artist.profilePic}
                      alt={artist.name}
                      width={350}
                      height={350}
                      loading="lazy"
                      className="object-cover rounded-lg"
                    />
                    <div className="mt-3 items-baseline flex flex-col gap-1">
                      <h2 className="text-[10px] bg-[#F2F4F8] p-1 rounded-full px-2 text-[#4A5E8B] capitalize">
                        {artist.artistType}
                      </h2>
                      <h2 className="font-bold text-sm text-nowrap">
                        {artist.name.slice(0, 15)}...
                      </h2>
                      <h2 className="text-primary text-sm">
                        ₹{" "}
                        {budget && artist[budget]
                          ? formatToIndianNumber(artist[budget])
                          : getFormattedRange(
                              artist?.price,
                              artist?.corporateBudget,
                              artist?.collegeBudget,
                              artist?.singerCumGuitaristBudget,
                              artist?.ticketingConcertBudget
                            )}
                      </h2>
                      <h2 className="text-gray-500 text-sm">
                        <div className="flex flex-cols">
                          <MapPin className="w-4 -mt-0.5" />{" "}
                          {artist.location.split(",")[0]}
                        </div>
                      </h2>
                    </div>
                  </Link>
                  {showEnquiry && (
                    <button
                      onClick={() => handleSendEnquiryClick(artist)}
                      className="rounded-md w-full mt-2 justify-center bg-[#FD4B3E] py-2 px-2 text-slate-50 inline-flex items-center gap-2 text-sm"
                    >
                      Send Enquiry
                    </button>
                  )}
                  {showBooking && (
                    <Link className="w-full" href={`/book/${artist.linkid}`}>
                      <button className="bg-[#FD4B3E] p-2 px-3 border-[1px] border-primary text-white rounded-md w-full text-center text-[14px] cursor-pointer hover:bg-primary hover:text-white">
                        Book Now
                      </button>
                    </Link>
                  )}
                </div>
                <div
                  className="lg:hidden flex md:flex-row p-1 pt-0 gap-2"
                  key={index}
                >
                  {/* Link only wraps the image */}
                  <Link
                    href={`/artist/${artist.linkid}?showBooking=true`}
                    className="w-2/4 mt-2"
                  >
                    {artist.profilePic ? (
                      <img
                        src={artist.profilePic}
                        alt={artist.name}
                        width={200}
                        height={200}
                        loading="lazy"
                        className="object-cover rounded-2xl border-[1px] shadow-xl"
                      />
                    ) : (
                      <div className="flex items-center justify-center object-cover rounded-2xl border-[1px] shadow-xl bg-gray-200 w-2/4">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </Link>

                  {/* Content section */}
                  <div className="w-3/4 mt-2">
                    <Link
                      href={`/artist/${artist.linkid}${eventTypeLink}`}
                      className=""
                    >
                      <div className="justify-between text-left pt-3">
                        {/* Name and Artist Type */}
                        <h2 className="font-bold text-sm tracking-wider pl-2">
                          {artist.name}
                        </h2>
                        <h2 className="text-[10px] capitalize ml-2 p-1 text-gray-400 bg-gray-100 rounded-full w-fit">
                          {artist.artistType.replace("-", " ")}
                        </h2>

                        {/* Genre */}
                        <div className="flex flex-row m-0 p-0">
                          <Music className="h-[12px] mt-[6px] opacity-50 -z-10" />
                          <h2 className="text-[10px] pl-2 rounded-full w-fit capitalize">
                            {artist.genre.slice(0, 30)}...
                          </h2>
                        </div>

                        {/* Price and Location */}
                        <div className="flex flex-row text-primary m-0 p-0">
                          <IndianRupee className="h-[12px] mt-[6px] opacity-50 -z-10" />
                          <h2 className="text-sm">
                            {budget && artist[budget]
                              ? formatToIndianNumber(artist[budget])
                              : getFormattedRange(
                                  artist?.price,
                                  artist?.corporateBudget,
                                  artist?.collegeBudget,
                                  artist?.singerCumGuitaristBudget,
                                  artist?.ticketingConcertBudget
                                )}
                          </h2>
                          <MapPin className="text-gray-500 h-[12px] opacity-50 -z-10 mt-1" />
                          <h2 className="text-gray-500 text-xs mt-0.5">
                            {artist.location.split(",")[0]}
                          </h2>
                        </div>
                      </div>
                    </Link>

                    {/* Send Enquiry Button */}
                    {showEnquiry && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendEnquiryClick(artist);
                        }}
                        className="bg-[#FD4B3E] p-1 px-2 border-[1px] border-primary text-white rounded-sm w-full text-center text-[11px] mt-2 cursor-pointer hover:bg-primary hover:text-white"
                      >
                        Send enquiry
                      </button>
                    )}

                    {/* Booking Button */}
                    {showBooking && (
                      <Link
                        href={`/book/${artist.linkid}?name=${name}&event=${selectedEventType}&location=${bookLocation}&date=${selectedDate}`}
                        className="w-full"
                      >
                        <button className="p-2 px-3 border-[1px] border-primary text-primary rounded-sm w-full text-center text-[14px] mt-2 cursor-pointer hover:bg-primary hover:text-white">
                          Book Now
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

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
                        : step === 5
                        ? "Basic Details"
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
                          onSelect={(date) => {
                            setStep(3);
                            setEventDate(date);
                          }}
                          className="border border-gray-300 rounded-md p-2"
                          initialFocus
                        />
                      )}
                      {step === 3 && (
                        <>
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
                          <SingleSearch
                            type="Top Cities"
                            list={[
                              "Mumbai",
                              "Navi Mumbai",
                              "Delhi",
                              "Kolkata",
                              "Chennai",
                              "Bangalore",
                              "Udaipur",
                              "Jaipur",
                              "Goa",
                              "Nagpur",
                              "Hyderabad",
                              "Pune",
                              "Bhopal",
                              "Indore",
                              "Lucknow",
                              "Visakhapatnam",
                              "Vadodara",
                              "Surat",
                              "Ahmedabad",
                              "Ranchi",
                              "Patna",
                              "Shimla",
                            ]}
                            topList={[
                              "Mumbai",
                              "Navi Mumbai",
                              "Delhi",
                              "Kolkata",
                              "Chennai",
                              "Bangalore",
                              "Udaipur",
                              "Jaipur",
                              "Goa",
                              "Nagpur",
                              "Hyderabad",
                              "Pune",
                              "Bhopal",
                              "Indore",
                              "Lucknow",
                              "Visakhapatnam",
                              "Vadodara",
                              "Surat",
                              "Ahmedabad",
                              "Ranchi",
                              "Patna",
                              "Shimla",
                            ]}
                            selectedItem={location}
                            setSelectedItem={handleLocationSelect}
                            showSearch={false}
                          />
                        </>
                      )}
                      {step === 4 && (
                        <>
                          <SignUp isModal={true} />
                        </>
                      )}
                      {step === 5 && (
                        <>
                          <ClientRegistration isModal={true} />
                        </>
                      )}
                      {step === 6 && (
                        <div className="flex flex-col items-start p-4 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
                          <p className="font-bold text-2xl mb-4 text-gray-800">
                            {Number(currentBudget.replace(/,/g, "")) > 1000000
                              ? "Premium Enquiry"
                              : "Confirm your Enquiry"}
                          </p>

                          <div className="mb-6 space-y-4">
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

                          <div className="flex gap-2">
                            {/* Free Enquiry Box */}
                            <div
                              onClick={() => setEnquiryOption("free")}
                              className={`cursor-pointer p-2 w-full rounded-lg border border-gray-300 ${
                                enquiryOption === "free"
                                  ? "bg-primary text-white"
                                  : "bg-gray-50"
                              }`}
                            >
                              <h3 className="font-semibold text-lg mb-2">
                                General Enquiry
                              </h3>
                              <ul className="text-gray-700">
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "free"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Basic Enquiry
                                  Management
                                </li>
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "free"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Free
                                  Consultation
                                </li>
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "free"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Standard
                                  Service Time
                                </li>
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "free"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">❌</span> General Event
                                  Assistance
                                </li>
                              </ul>
                              <p className="font-bold my-2 text-lg">
                                Fees: ₹0/-
                              </p>
                            </div>

                            {/* Chargeable Enquiry Box */}
                            <div
                              onClick={() => setEnquiryOption("premium")}
                              className={`cursor-pointer p-2 w-full rounded-lg border border-gray-300 ${
                                enquiryOption === "premium"
                                  ? "bg-primary text-white"
                                  : "bg-gray-50"
                              }`}
                            >
                              <h3 className="font-semibold text-lg mb-2">
                                Premium Enquiry
                              </h3>
                              <ul className="text-gray-700">
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "premium"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Prioritize
                                  Enquiries
                                </li>
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "premium"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Avoid SPAM
                                  Enquiries
                                </li>
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "premium"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Fast Service
                                </li>
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "premium"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Dedicated
                                  Artist Manager
                                </li>
                                <li
                                  className={`flex items-center text-sm whitespace-nowrap ${
                                    enquiryOption === "premium"
                                      ? "bg-primary text-white"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span className="mr-2">✔️</span> Customized
                                  Solutions
                                </li>
                              </ul>
                              <p className="font-bold my-2 text-lg">
                                Fees: ₹
                                {Number(currentBudget.replace(/,/g, "")) >
                                1000000
                                  ? "99"
                                  : "49"}
                                /-
                              </p>
                            </div>
                          </div>
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
                        {step === 6 &&
                          (enquiryOption === "free" ? (
                            <Button onClick={() => sendDataEnquiry()}>
                              Send Enquiry
                            </Button>
                          ) : enquiryOption === "premium" ? (
                            <PayButton
                              amount={
                                Number(currentBudget.replace(/,/g, "")) >
                                1000000
                                  ? 99
                                  : 49
                              }
                              name={client.name}
                              email={client.email}
                              contact={client.contact}
                              linkid={currentArtistId}
                              eventType={eventType}
                              eventDate={eventDate}
                              location={location}
                              budget={currentBudget}
                            />
                          ) : null)}
                      </div>
                    </div>
                  </Modal>
                )}
              </>
            );
          })
        ) : (
          <div className="items-center justify-center text-center p-4">
            {!showEnquiry && (
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
