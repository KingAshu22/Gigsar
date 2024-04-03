"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function ArtistSuggestionList(artist = { artist }) {
  const [artistList, setArtistList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getArtistList();
  }, []);
  const getArtistList = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API}/artist/artistType/ ` + artist.artistType
      )
      .then((response) => {
        setArtistList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
        setLoading(false);
      });
  };
  return (
    <div className=" p-4 border-[1px] mt-5 md:ml-5 rounded-lg ">
      <h2 className="mb-3 font-bold">Suggestions</h2>

      {artistList.map((artist, index) => (
        <Link
          href={"/artist/" + artist.linkid}
          className=" mb-4 p-3 shadow-sm w-full 
            cursor-pointer hover:bg-slate-100
            rounded-lg flex items-center gap-3"
          key={index}
        >
          <Image
            src={artist.profilePic}
            width={70}
            height={70}
            className="w-[70px] h-[70px] rounded-full object-cover"
          />
          <div className="mt-3 flex-col flex gap-1 items-baseline">
            <h2
              className="text-[10px] bg-blue-100 p-1 rounded-full px-2
                     text-primary"
            >
              {artist.artistType}
            </h2>
            <h2 className="font-medium text-sm">{artist.name}</h2>
            <h2 className="text-primary text-xs flex gap-2">
              {/* <GraduationCap/> */}
              10+ Years of Experience
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ArtistSuggestionList;
