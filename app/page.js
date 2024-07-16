"use client";
import Hero from "./_components/Hero";
import { useEffect, useState } from "react";
import axios from "axios";
import ArtistFilter from "./(route)/artist/page";
import MyBot from "./_components/MyBot";

export default function Home() {
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/artist`)
      .then((response) => {
        const filteredArtists = response.data.filter(
          (artist) => artist.showGigsar
        );
        setArtists(filteredArtists);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
      });
  }, []);
  return (
    <div>
      {/* Hero Section  */}
      <Hero />
      <MyBot />
      {/* Popular Artists List  */}
      <ArtistFilter />
    </div>
  );
}
