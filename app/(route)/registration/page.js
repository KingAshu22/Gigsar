"use client";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Cropper, getCroppedImg } from "react-cropper-custom";
import "react-cropper-custom/dist/index.css";
import "./modal.css"; // Import CSS for modal styles
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { fromBase64 } from "@aws-sdk/util-base64";
import { nanoid } from "nanoid";
import eventTypesOptions from "./constants/eventTypes";
import genreOptions from "./constants/genres";
import instrumentOptions from "./constants/instruments";
import languageOptions from "./constants/languages";
import { Button } from "@/components/ui/button";

const ArtistRegistration = () => {
  const [artistName, setArtistName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [cropData, setCropData] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [showCroppedImage, setShowCroppedImage] = useState(false); // State to manage cropped image display
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gallerySrc, setGallerySrc] = useState(null);
  const [galleryCropData, setGalleryCropData] = useState([]);
  const [galleryZoom, setGalleryZoom] = useState(1);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryLink, setGalleryLink] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState([""]);
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [artistType, setArtistType] = useState("");
  const [eventTypes, setEventTypes] = useState([]);
  const [corporateBudget, setCorporateBudget] = useState("");
  const [collegeBudget, setCollegeBudget] = useState("");
  const [weddingBudget, setWeddingBudget] = useState("");
  const [singerCumGuitaristBudget, setSingerCumGuitaristBudget] = useState("");
  const [singerPlusGuitaristBudget, setSingerPlusGuitaristBudget] =
    useState("");
  const [ticketingConcertBudget, setTicketingConcertBudget] = useState("");
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [originalSongName, setOriginalSongName] = useState("");
  const [performanceTime, setPerformanceTime] = useState("");
  const [instruments, setInstruments] = useState([]);
  const [awards, setAwards] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [musicTraining, setMusicTraining] = useState("");
  const [aboutArtist, setAboutArtist] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleEventTypeChange = (event) => {
    const selectedEventType = event.target.value;
    if (event.target.checked) {
      setEventTypes([...eventTypes, selectedEventType]);
    } else {
      setEventTypes(eventTypes.filter((type) => type !== selectedEventType));
    }
  };
  const handleGenreChange = (event) => {
    const selectedGenre = event.target.value;
    if (event.target.checked) {
      setGenres([...genres, selectedGenre]);
    } else {
      setGenres(genres.filter((type) => type !== selectedGenre));
    }
  };
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    if (event.target.checked) {
      setLanguages([...languages, selectedLanguage]);
    } else {
      setLanguages(languages.filter((type) => type !== selectedLanguage));
    }
  };
  const handleInstrumentChange = (event) => {
    const selectedInstrument = event.target.value;
    if (event.target.checked) {
      setInstruments([...instruments, selectedInstrument]);
    } else {
      setInstruments(instruments.filter((type) => type !== selectedInstrument));
    }
  };
  const onFileDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowModal(true); // Show the modal after image upload
      };
      reader.readAsDataURL(file);
    }
  };

  const onGalleryDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setGallerySrc(reader.result);
        setShowGalleryModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = async (croppedArea) => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedArea);
      setCropData(croppedImg);
      console.log(cropData);
    } catch (e) {
      console.error(e);
    }
  };

  const onGalleryCropComplete = async (croppedArea) => {
    try {
      const croppedImg = await getCroppedImg(gallerySrc, croppedArea);
      setGalleryCropData((prevCropData) => {
        const updatedCropData = [...prevCropData, croppedImg];
        return updatedCropData;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    setGalleryImages((prevImages) => {
      const updatedImages = [...prevImages, galleryCropData[currentImageIndex]];
      if (updatedImages.length === 9) {
        // Last image, trigger upload
        handleGalleryUpload(updatedImages);
        setShowGalleryModal(false);
      } else {
        setCurrentImageIndex((prevIndex) => prevIndex + 1);
        setGallerySrc(null);
      }
      return updatedImages;
    });
  };

  const handleGallerySave = () => {
    // Save cropped image
    setGalleryImages((prevImages) => {
      const updatedImages = [...prevImages, galleryCropData[currentImageIndex]];
      handleGalleryUpload(updatedImages);
      setShowGalleryModal(false);
      return updatedImages;
    });
  };

  const handleProfileUpload = async (base64, artistName) => {
    try {
      const img = new Image();
      img.src = base64;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 350;
        canvas.height = 350;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 350, 350);
        const webpData = canvas.toDataURL("image/webp", 0.8);
        const imageData = webpData.split(",")[1];
        const response = await uploadProfileToS3(imageData, artistName);
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      // Show error message to the user
    }
  };

  const handleGalleryUpload = async (images) => {
    try {
      const promises = images.map(async (gallery) => {
        const img = new Image();
        img.src = gallery;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Create a canvas element for image manipulation
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize the image to 350x350
        const aspectRatio = img.width / img.height;
        let newWidth, newHeight;
        if (aspectRatio > 1) {
          newWidth = 350;
          newHeight = 350 / aspectRatio;
        } else {
          newWidth = 350 * aspectRatio;
          newHeight = 350;
        }
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Compress and convert to WebP format
        const webpData = canvas.toDataURL("image/webp", 0.8);
        const imageData = webpData.split(",")[1];

        // Upload to S3
        await uploadGalleryToS3(imageData, artistName);
      });
      await Promise.all(promises);
    } catch (error) {
      console.error("Error uploading images:", error);
      // Show error message to the user
    }
  };

  const uploadProfileToS3 = async (base64, artistName) => {
    try {
      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        },
      });

      const folderName = artistName.replace(/\s+/g, "-");
      const folderKey = `${folderName}/`;

      // Check if the folder exists
      const listObjectsCommand = new ListObjectsCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Prefix: folderKey,
      });
      const { Contents } = await s3Client.send(listObjectsCommand);

      if (!Contents || Contents.length === 0) {
        // Create the folder
        const createFolderParams = {
          Bucket: process.env.NEXT_PUBLIC_BUCKET,
          Key: folderKey,
        };
        const putObjectCommand = new PutObjectCommand(createFolderParams);
        await s3Client.send(putObjectCommand);
      }

      const fileName = `${nanoid()}.webp`;
      const buffer = fromBase64(base64);
      const uploadParams = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: `${folderKey}${fileName}`,
        Body: buffer,
        ACL: "public-read",
        ContentType: "image/webp",
      };
      const putObjectCommand = new PutObjectCommand(uploadParams);
      const response = await s3Client.send(putObjectCommand);

      const location = `https://${process.env.NEXT_PUBLIC_BUCKET}.s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${folderName}/${fileName}`;
      // console.log("Image uploaded successfully:", location);
      setProfilePic(location);
      return location;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const uploadGalleryToS3 = async (base64, artistName) => {
    try {
      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        },
      });

      const folderName = artistName.replace(/\s+/g, "-");
      const folderKey = `${folderName}/`;

      // Check if the folder exists
      const listObjectsCommand = new ListObjectsCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Prefix: folderKey,
      });
      const { Contents } = await s3Client.send(listObjectsCommand);

      if (!Contents || Contents.length === 0) {
        // Create the folder
        const createFolderParams = {
          Bucket: process.env.NEXT_PUBLIC_BUCKET,
          Key: folderKey,
        };
        const putObjectCommand = new PutObjectCommand(createFolderParams);
        await s3Client.send(putObjectCommand);
      }

      const fileName = `${nanoid()}.webp`;
      const buffer = fromBase64(base64);
      const uploadParams = {
        Bucket: process.env.NEXT_PUBLIC_BUCKET,
        Key: `${folderKey}${fileName}`,
        Body: buffer,
        ACL: "public-read",
        ContentType: "image/webp",
      };
      const putObjectCommand = new PutObjectCommand(uploadParams);
      const response = await s3Client.send(putObjectCommand);

      const location = `https://${process.env.NEXT_PUBLIC_BUCKET}.s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com/${folderName}/${fileName}`;
      // console.log("Image uploaded successfully:", location);
      setGalleryLink((prevLinks) => [...prevLinks, location]);
      return location;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Function to add more input fields
  const addMoreLink = () => {
    setYoutubeLinks((prevLinks) => [...prevLinks, ""]);
  };

  // Function to handle input change
  const handleLinkChange = (index, value) => {
    const updatedLinks = [...youtubeLinks];
    updatedLinks[index] = value;
    setYoutubeLinks(updatedLinks);
  };

  const handleSave = async () => {
    // Handle saving the cropped image
    // For demonstration, let's log the cropped image data
    setShowModal(false); // Close the modal after saving
    setShowCroppedImage(true); // Show the cropped image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      // Handle profile pic upload
      await handleProfileUpload(cropData, artistName);
      await handleGalleryUpload(galleryCropData, artistName);

      // Handle the submission of form data
      const formData = {
        artistName,
        profilePic,
        galleryLink,
        youtubeLinks,
        gender,
        contactNumber,
        email,
        location,
        artistType,
        eventTypes,
        corporateBudget,
        collegeBudget,
        weddingBudget,
        singerCumGuitaristBudget,
        singerPlusGuitaristBudget,
        ticketingConcertBudget,
        genres,
        languages,
        originalSongName,
        performanceTime,
        instruments,
        awards,
        instagramLink,
        facebookLink,
        youtubeLink,
        spotifyLink,
        musicTraining,
        aboutArtist,
      };

      console.log(formData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/artist-registration`,
        formData
      );

      setShowConfirmationModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to home page or perform any other action
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
        {!showCroppedImage && (
          <div className="mb-4">
            <label
              htmlFor="profilePic"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Profile Pic
            </label>
            <Dropzone
              onDrop={onFileDrop}
              acceptedFiles={["image/*"]}
              maxFileSize={5000000}
            >
              {({ getRootProps, getInputProps }) => (
                <section className="bg-gray-200 rounded-lg p-4 pt-8 pb-8 text-center max-w-36">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag & drop Profile Pic here, or click to select Profile
                      Pic
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        )}
        {showCroppedImage && cropData && (
          <>
            <label className="block text-sm font-medium text-gray-700">
              Profile Pic
            </label>
            <img
              src={cropData}
              alt="Cropped Image"
              className="mb-4 rounded-lg max-w-36"
            />
          </>
        )}
        {showModal && imageSrc && (
          <div className="modal-overlay">
            <div className="modal flex flex-col gap-4">
              <Cropper
                src={imageSrc}
                width={300}
                height={300}
                zoom={zoom}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <button
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
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
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
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
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="artistType"
            className="block text-sm font-medium text-gray-700"
          >
            Artist Type
          </label>
          <select
            id="artistType"
            value={artistType}
            onChange={(e) => setArtistType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Artist Type</option>
            <option value="Singer">Singer</option>
            <option value="Live Band">Live Band</option>
            <option value="Musician">Musician</option>
            <option value="DJ">DJ</option>
          </select>
        </div>

        <Dropzone
          onDrop={onGalleryDrop}
          acceptedFiles={["image/*"]}
          maxFiles={9 - galleryImages.length}
          maxFileSize={5000000}
        >
          {({ getRootProps, getInputProps }) => (
            <section className="bg-gray-200 rounded-lg p-4 pt-8 pb-8 text-center max-w-36">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag & drop images here, or click to select images</p>
              </div>
            </section>
          )}
        </Dropzone>
        {showGalleryModal && gallerySrc && (
          <div className="modal-overlay">
            <div className="modal flex flex-col gap-4">
              <Cropper
                src={gallerySrc}
                width={300}
                height={300}
                zoom={galleryZoom}
                onZoomChange={setGalleryZoom}
                onCropComplete={onGalleryCropComplete}
              />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={galleryZoom}
                onChange={(e) => setGalleryZoom(parseFloat(e.target.value))}
              />
              {currentImageIndex === 8 ? (
                <button onClick={handleGallerySave}>Save</button>
              ) : (
                <button onClick={handleNext}>Next</button>
              )}
            </div>
          </div>
        )}
        {galleryImages.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Gallery Image ${index + 1}`}
              className="mb-4 rounded-lg max-w-36"
            />
          </div>
        ))}

        <div className="mb-4">
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-700"
            >
              YouTube Link:
            </label>
            {youtubeLinks.map((link, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`youtubeLink-${index}`}
                  value={link}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <Button type="button" className="" onClick={addMoreLink}>
            Add More Link
          </Button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Event Types
          </label>
          <div className="grid grid-cols-3 gap-4">
            {eventTypesOptions.map((option) => (
              <div className="" key={option}>
                <input
                  type="checkbox"
                  id={option}
                  value={option}
                  onChange={handleEventTypeChange}
                  className="mr-2"
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        </div>

        {eventTypes.includes("Corporate") && (
          <div className="mb-4">
            <label
              htmlFor="corporateBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Corporate Budget
            </label>
            <input
              type="number"
              id="corporateBudget"
              value={corporateBudget}
              onChange={(e) => setCorporateBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        {eventTypes.includes("College") && (
          <div className="mb-4">
            <label
              htmlFor="collegeBudget"
              className="block text-sm font-medium text-gray-700"
            >
              College Budget
            </label>
            <input
              type="number"
              id="collegeBudget"
              value={collegeBudget}
              onChange={(e) => setCollegeBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        {eventTypes.includes("Wedding") && (
          <div className="mb-4">
            <label
              htmlFor="weddingBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Wedding Budget
            </label>
            <input
              type="number"
              id="weddingBudget"
              value={weddingBudget}
              onChange={(e) => setWeddingBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        {eventTypes.includes("House Party") && (
          <>
            <div className="mb-4">
              <label
                htmlFor="singerCumGuitaristBudget"
                className="block text-sm font-medium text-gray-700"
              >
                Singer cum Guitarist Budget
              </label>
              <input
                type="number"
                id="singerCumGuitaristBudget"
                value={singerCumGuitaristBudget}
                onChange={(e) => setSingerCumGuitaristBudget(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="singerPlusGuitaristBudget"
                className="block text-sm font-medium text-gray-700"
              >
                Singer + Guitarist Budget
              </label>
              <input
                type="number"
                id="singerPlusGuitaristBudget"
                value={singerPlusGuitaristBudget}
                onChange={(e) => setSingerPlusGuitaristBudget(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </>
        )}

        {eventTypes.includes("Ticketing Concert") && (
          <div className="mb-4">
            <label
              htmlFor="ticketingConcertBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Ticketing Concert Budget
            </label>
            <input
              type="number"
              id="ticketingConcertBudget"
              value={ticketingConcertBudget}
              onChange={(e) => setTicketingConcertBudget(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
            {genreOptions.map((option) => (
              <div key={option}>
                <input
                  type="checkbox"
                  id={option}
                  value={option}
                  onChange={handleGenreChange}
                  className="mr-2"
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Language Speaks
          </label>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
            {languageOptions.map((option) => (
              <div key={option}>
                <input
                  type="checkbox"
                  id={option}
                  value={option}
                  onChange={handleLanguageChange}
                  className="mr-2"
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="originalSong"
            className="block text-sm font-medium text-gray-700"
          >
            Original Songs Name
          </label>
          <input
            type="text"
            id="originalSongs"
            value={originalSongName}
            onChange={(e) => setOriginalSongName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="performanceTime"
            className="block text-sm font-medium text-gray-700"
          >
            Performance Time in Mins
          </label>
          <input
            type="number"
            id="performanceTime"
            value={performanceTime}
            onChange={(e) => setPerformanceTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Which Instruments do you play
          </label>
          <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
            {instrumentOptions.map((option) => (
              <div key={option}>
                <input
                  type="checkbox"
                  id={option}
                  value={option}
                  onChange={handleInstrumentChange}
                  className="mr-2"
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="performanceTime"
            className="block text-sm font-medium text-gray-700"
          >
            Any Awards/Achievements/Fame
          </label>
          <input
            type="text"
            id="awards"
            value={awards}
            onChange={(e) => setAwards(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="instagramLink"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram Profile Link
          </label>
          <input
            type="text"
            id="instagramLink"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="facebookLink"
            className="block text-sm font-medium text-gray-700"
          >
            Facebook Profile Link
          </label>
          <input
            type="text"
            id="facebookLink"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="youtubeLink"
            className="block text-sm font-medium text-gray-700"
          >
            Youtube Channel Link
          </label>
          <input
            type="text"
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="spotifyLink"
            className="block text-sm font-medium text-gray-700"
          >
            Spotify Profile Link
          </label>
          <input
            type="text"
            id="spotifyLink"
            value={spotifyLink}
            onChange={(e) => setSpotifyLink(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="musicTraining"
            className="block text-sm font-medium text-gray-700"
          >
            Music Training From
          </label>
          <input
            type="text"
            id="musicTraining"
            value={musicTraining}
            onChange={(e) => setMusicTraining(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="aboutArtist"
            className="block text-sm font-medium text-gray-700"
          >
            Tell Me About Yourself
          </label>
          <Textarea
            id="aboutArtist"
            value={aboutArtist}
            onChange={(e) => setAboutArtist(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to submit the form?</p>
            <button onClick={handleConfirmSubmit}>Yes</button>
            <button onClick={() => setShowConfirmationModal(false)}>No</button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Success! Your form has been submitted.</p>
            <button onClick={handleModalClose}>Back to home page</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistRegistration;
