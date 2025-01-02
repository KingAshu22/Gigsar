"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import SendEnquiry from "./SendEnquiry";
import { MapPin, Phone } from "lucide-react";
import { formatToIndianNumber } from "@/lib/utils";
import Script from "next/script";
import Modal from "./Modal";
import SingleSearch from "./SingleSearch";
import { Calendar } from "@/components/ui/calendar";
import SignUp from "../(route)/(auth)/sign-up/page";
import ClientRegistration from "../(route)/user-dashboard/registration/page";
import axios from "axios";
import PayButton from "./PayButton";

const Sidebar = ({
  artist,
  profilePic,
  name,
  artistType,
  price,
  corporateBudget,
  collegeBudget,
  singerCumGuitaristBudget,
  ticketingConcertBudget,
}) => {
  const inputRef = useRef(null);
  const [currentArtistId, setCurrentArtistId] = useState(null);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [currentBudget, setCurrentBudget] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState(null);

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
    if (eventType !== "All Event Types") {
      setEventType(eventType);
      if (eventType === "Corporate") {
        setBudget("corporateBudget");
      } else if (eventType === "Wedding") {
        setBudget("price");
      } else if (eventType === "College") {
        setBudget("collegeBudget");
      } else if (eventType === "Ticketing Concert") {
        setBudget("ticketingConcertBudget");
      }
    }
  }, [eventType]);

  useEffect(() => {
    setCurrentBudget(
      budget && artist[budget]
        ? Number(artist[budget]).toLocaleString("en-IN")
        : Number(artist?.price).toLocaleString("en-IN")
    );
  }, [budget]);

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
    setShowModal(true);
  };

  useEffect(() => {
    if (step === 4) {
      const intervalId = setInterval(() => {
        const mobile = localStorage.getItem("mobile");
        if (mobile && mobile.length > 0) {
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
    <>
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
      <div className="col-span-12 lg:col-span-3 p-0 m-0">
        <div className="bg-slate-200 dark:bg-[#111111] rounded-2xl lg:mb-10 py-2 md:sticky top-24 left-0">
          <div className="overflow-hidden text-center w-40 h-40 mx-[70px]">
            <img src={profilePic} className="rounded-2xl" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold dark:text-white">{name}</h2>
            <h1 className="text-[#7B7B7B] inline-block dark:bg-[#1D1D1D] px-5 rounded-lg dark:text-[#A6A6A6] capitalize">
              {artistType?.replace("-", " ")}
            </h1>
          </div>
          {/* <div className="flex justify-center space-x-3">
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#1773EA] hover:text-slate-50"
            >
              <FaFacebookF />
            </a>
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#1C9CEA] hover:text-slate-50"
            >
              <AiOutlineTwitter />
            </a>
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#e14a84] hover:text-slate-50"
            >
              <AiOutlineDribbble />
            </a>
            <a
              href="/"
              className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-mid-dark hover:hover_active text-[#0072b1] hover:text-slate-50"
            >
              <RiLinkedinFill />
            </a>
          </div> */}
          <div className="px-4 mb-4 md:ml-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Budgets
            </h2>
            <div className="space-y-2">
              {price && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wedding Event:</span>
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                      ₹ {formatToIndianNumber(price)}
                    </span>
                  </div>
                  <hr />
                </>
              )}
              {corporateBudget && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Corporate Event:</span>
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                      ₹ {formatToIndianNumber(corporateBudget)}
                    </span>
                  </div>
                  <hr />
                </>
              )}
              {collegeBudget && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">College Event:</span>
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                      ₹ {formatToIndianNumber(collegeBudget)}
                    </span>
                  </div>
                  <hr />
                </>
              )}
              {singerCumGuitaristBudget && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">House/Private Event:</span>
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                      ₹ {formatToIndianNumber(singerCumGuitaristBudget)}
                    </span>
                  </div>
                  <hr />
                </>
              )}
              {ticketingConcertBudget && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ticketing Concert:</span>
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                      ₹ {formatToIndianNumber(ticketingConcertBudget)}
                    </span>
                  </div>
                  <hr />
                </>
              )}
            </div>
          </div>
          {/* <ul className="flex flex-col bg-light-gray dark:bg-mid-dark px-7">
          <li className="flex items-center gap-6 border-b border-slate-300 py-3">
            <div className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-[#111111] text-primary hover:hover_active group cursor-pointer">
              <Phone />
            </div>
            <div className="flex flex-col dark:text-white">
              <span className="text-slate-500 text-xs font-bold">Phone</span>
              <a
                className="transition-all duration-100 hover:text-primary"
                href="tel:+917021630747"
              >
                +91 70216 30747
              </a>
            </div>
          </li>
          <li className="flex items-center gap-6 border-b border-slate-300 py-3">
            <div className="w-10 h-10 rounded bg-light-gray flex items-center justify-center shadow-md dark:bg-black text-primary hover:hover_active group cursor-pointer text-xl">
              <MapPin />
            </div>
            <div className="flex flex-col dark:text-white">
              <span className="text-slate-500 text-xs font-bold">Location</span>
              <span className="transition-all duration-100">Mumbai</span>
            </div>
          </li>
        </ul> */}
          <div className="text-center">
            <Button
              className="rounded-3xl bg-gradient-to-r from-[#FA5252] to-[#DD2476] py-3 px-6 text-slate-50 inline-flex items-center gap-2 text-md"
              onClick={() => handleSendEnquiryClick(artist)}
            >
              Send Enquiry
            </Button>
          </div>
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
                      ? (eventDate || selectedDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not selected"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Budget:</strong>{" "}
                    {formatToIndianNumber(currentBudget)}
                  </p>
                  <p className="text-gray-700">
                    <strong>Location:</strong> {location}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h2 className="text-primary font-semibold mb-4">
                    Why Pay ₹
                    {Number(currentBudget.replace(/,/g, "")) > 1000000 ? (
                      <span>99</span>
                    ) : (
                      <span>49</span>
                    )}{" "}
                    as Enquiry Charges?
                  </h2>
                  <ul className="list-disc list-inside text-gray-800 font-medium mb-2">
                    <li>Prioritize Enquiries</li>
                    <li>Avoid SPAM Enquiries</li>
                    <li>Fast Service</li>
                    <li>Dedicated Artist Manager</li>
                  </ul>
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
                (Number(currentBudget.replace(/,/g, "")) > 1000000 ? (
                  <PayButton
                    amount={99}
                    name={client.name}
                    email={client.email}
                    contact={client.contact}
                    linkid={currentArtistId}
                    eventType={eventType}
                    eventDate={eventDate}
                    location={location}
                    budget={currentBudget}
                  />
                ) : (
                  <PayButton
                    amount={49}
                    name={client.name}
                    email={client.email}
                    contact={client.contact}
                    linkid={currentArtistId}
                    eventType={eventType}
                    eventDate={eventDate}
                    location={location}
                    budget={currentBudget}
                  />
                ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
