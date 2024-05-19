"use client";
import Hero from "./_components/Hero";
import CategorySearch from "./_components/CategorySearch";
import ArtistList from "./_components/ArtistList";
import { useEffect, useState } from "react";
import axios from "axios";

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

      {/* Search bar + Categories  */}
      <CategorySearch />

      {/* Popular Artists List  */}
      <ArtistList artists={artists} />
    </div>
  );
}
