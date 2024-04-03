"use client";
import React, { useEffect, useState } from "react";
import ArtistDetail from "./_components/ArtistDetail";
import ArtistSuggestionList from "./_components/ArtistSuggestionList";
import axios from "axios";

function ArtistDetails({ params }) {
  const [artist, setArtist] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getArtist();
  }, []);
  const getArtist = () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/artist/artistName/` + params.artist)
      .then((response) => {
        setArtist(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
        setLoading(false);
      });
  };
  return (
    <div className="p-5 md:px-10">
      <h2 className="font-bold text-[22px]">Artist Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 ">
        {/* Artist Detail  */}
        <div className=" col-span-3">
          {artist && <ArtistDetail artist={artist} />}
        </div>
        {/* Artist Suggestion  */}
        <div>
          <ArtistSuggestionList artist={artist} />
        </div>
      </div>
    </div>
  );
}

export default ArtistDetails;
