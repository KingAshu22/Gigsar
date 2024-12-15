import React, { useState } from "react";
import Modal from "./Modal";
import SingleSearch from "./SingleSearch";
import { Calendar } from "@/components/ui/calendar";
import ClientRegistration from "../(route)/user-dashboard/registration/page";

const SendEnquiry = ({ sendEnquiry, artist }) => {
  const [showModal, setShowModal] = useState(sendEnquiry);
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState();
  const [location, setLocation] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
    setEventType("");
    setEventDate("");
    setLocation("");
    setStep(1);
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

  return (
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
            list={artist?.eventsType.split(", ")}
            topList={artist?.eventsType.split(", ")}
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
                  ? (eventDate || selectedDate).toLocaleDateString("en-GB", {
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

            {/* <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h2 className="text-primary font-semibold mb-4">
                              Why Pay ₹
                              {Number(currentBudget.replace(/,/g, "")) >
                              1000000 ? (
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
                          </div> */}
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
  );
};

export default SendEnquiry;
