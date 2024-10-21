import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function EnquiryModal(
  showModal,
  step,
  setStep,
  isValid,
  handleModalClose,
  eventType,
  setEventType,
  eventTypesOptions
) {
  useEffect(() => {
    if (step === 4) {
      sendEnquiry();
      const rzpPaymentForm = document.getElementById("rzp_payment_form");

      if (!rzpPaymentForm.hasChildNodes()) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.async = true;
        script.dataset.payment_button_id = "pl_PAW3XEg9owspeG";
        rzpPaymentForm.appendChild(script);
      }
    }
  }, [step]);
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
          ? "Confirm Enquiry"
          : "No Step"
      }
    >
      <div className="flex flex-col items-center">
        {step === 1 && (
          <SingleSearch
            type="Event Type"
            list={eventTypesOptions}
            topList={eventTypesOptions}
            selectedItem={eventType}
            setSelectedItem={(item) => {
              setEventType(item);
              setStep(2);
            }}
            showSearch={true}
          />
        )}
        {step === 2 && (
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
        {step === 3 && (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Event City
            </label>
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
          </>
        )}
        {step === 4 && (
          <div className="flex flex-col items-start p-4 bg-white shadow-lg rounded-lg">
            <p className="font-bold text-lg mb-4 text-gray-800">
              {Number(currentBudget.replace(/,/g, "")) > 1000000
                ? "Premium Artist Enquiry"
                : "Confirm your Enquiry"}
            </p>
            <div className="mb-4">
              <p className="text-gray-700">
                <strong>Artist Type:</strong> {formatString(artistType)}
              </p>
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

            {Number(currentBudget.replace(/,/g, "")) > 1000000 && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800 font-medium mb-2">
                  To ensure the best experience and prioritize genuine
                  inquiries, a small, non-refundable fee of <strong>₹99</strong>{" "}
                  is required when submitting your request. This guarantees that
                  only serious clients are connected with our celebrity artists.
                </p>
                <p className="text-gray-700 mb-2">
                  By paying this fee, you're confirming your commitment and
                  helping us provide top-quality service for both you and the
                  artists.
                </p>
                <p className="text-gray-700 font-semibold">
                  Secure your preferred celebrity artist by taking this next
                  step!
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
              onClick={() => setStep(4)}
            >
              Next
            </button>
          )}
          {isValid && step === 3 && (
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setStep(5)}
            >
              Next
            </button>
          )}
          {step === 4 &&
            (Number(currentBudget.replace(/,/g, "")) > 1000000 ? (
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
                      error: "Error sending Enquiry, Please try again later",
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
  );
}
