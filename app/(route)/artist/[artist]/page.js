"use client";
import React, { useEffect, useState } from "react";
import ArtistDetail from "./_components/ArtistDetail";
import axios from "axios";
import ArtistPricing from "./_components/ArtistPricing";
import { Spinner } from "./_components/Spinner";
import Head from "next/head"; // Import Head for managing head elements

function ArtistDetails({ params }) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getArtist();
  }, []);

  const getArtist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/artists/` + params.artist);
      setArtist(response.data);
    } catch (error) {
      console.error("Error fetching artist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:px-10">
      {/* Dynamic meta tags */}
      {artist && (
        <Head>
          <title>{artist.name} | Gigsar</title>
          <meta
            name="description"
            content={`Learn more about ${artist.name}, a talented artist available for events and bookings.`}
          />
          <meta property="og:title" content={artist.name} />
          <meta
            property="og:description"
            content={`Learn more about ${artist.name}, a talented artist available for events and bookings.`}
          />
          <meta property="og:image" content={artist.profilePic} />
          <meta property="og:url" content={window.location.href} />{" "}
          {/* Include current URL */}
        </Head>
      )}

      <h2 className="font-bold text-2xl mb-5 text-gray-800">Artist Details</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Artist Detail */}
          <div className="col-span-3">
            {artist ? (
              <ArtistDetail artist={artist} />
            ) : (
              <p className="text-gray-500">Artist details not available.</p>
            )}
          </div>
          {/* Artist Pricing */}
          <div>{artist ? <ArtistPricing artist={artist} /> : null}</div>
        </div>
      )}
    </div>
  );
}

export default ArtistDetails;
