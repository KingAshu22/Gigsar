"use client";
import React, { useEffect, useState } from "react";
import "react-cropper-custom/dist/index.css";
import "./modal.css"; // Import CSS for modal styles
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "@/app/_components/Modal";
import { HashLoader } from "react-spinners";

const ArtistRegistration = () => {
  const [expiryTime, setExpiryTime] = useState();
  const [name, setName] = useState();
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [clientId, setClientId] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setExpiryTime(localStorage?.getItem("authExpiry"));
    setContact("+" + localStorage?.getItem("mobile"));
  }, []);

  // Function to generate client ID
  const generateClientId = (name) => {
    if (!name) return "";
    const firstName = name.split(" ")[0]; // Get the first word of the name
    const formattedName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const randomCode = Math.floor(1000 + Math.random() * 9000); // 4-digit random code
    return `${formattedName}@${randomCode}`;
  };

  // Generate ID when the name changes
  useEffect(() => {
    if (name) {
      setClientId(generateClientId(name));
    }
  }, [name]);

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
        expiryTime,
        name,
        contact,
        email,
        type,
        clientId,
      };

      const response = axios.post(
        `${process.env.NEXT_PUBLIC_API}/client-registration`,
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
      <h1 className="text-xl font-bold mb-4">User Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="artistName"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Type</option>
            <option value="Client">Direct Client</option>
            <option value="Event Manager">Event Manager</option>
            <option value="Wedding Planner">Wedding Planner</option>
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
            id="contact"
            value={contact}
            readOnly
            onChange={(e) => setContact(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
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
        description={`This will create a profile for ${name}`}
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
        title={`${type} Registered`}
        description={`${name}'s Profile is created successfully`}
      >
        <div className="flex justify-center">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={() => router.push("/user-dashboard")}
          >
            Dashboard
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ArtistRegistration;
