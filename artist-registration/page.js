"use client";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";

export default function ArtistRegistration() {
  const [artistName, setArtistName] = useState("");
  const [files, setFiles] = useState([]);

  const handleChange = (files) => {
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("artistName", artistName);
    files.forEach((file) => {
      formData.append("photos", file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data); // Process server response
  };

  return (
    <div className="container mx-auto p-5">
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
            onChange={(e) => setArtistName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Photos
          </label>
          <Dropzone
            onDrop={handleChange}
            acceptedFiles={["image/*"]}
            maxFileSize={5000000}
            filesLimit={10}
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
