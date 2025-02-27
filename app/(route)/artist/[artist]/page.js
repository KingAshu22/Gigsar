"use client";
import React, { useEffect, useState } from "react";
import ArtistDetail from "./_components/ArtistDetail";
import axios from "axios";
import ArtistPricing from "./_components/ArtistPricing";
import { Spinner } from "./_components/Spinner";
import Head from "next/head"; // Import Head for managing head elements
import Sidebar from "@/app/_components/SideBar";
import MainContent from "@/app/_components/MainContent";

function ArtistDetails({ params }) {
  const [artist, setArtist] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams?.get("showBooking") === "true") {
      setShowBooking(true);
    }
    setEventType(searchParams.get("selectedEventType"));
    setEventDate(new Date(searchParams.get("date")));
    setEventLocation(searchParams.get("location"));
    setName(searchParams.get("name"));
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
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-12 lg:gap-10 mx-4">
          <Sidebar
            artist={artist}
            profilePic={artist?.profilePic}
            name={artist?.name}
            artistType={artist?.artistType}
            location={artist?.location}
            price={artist?.price}
            corporateBudget={artist?.corporateBudget}
            collegeBudget={artist?.collegeBudget}
            singerCumGuitaristBudget={artist?.singerCumGuitaristBudget}
            ticketingConcertBudget={artist?.ticketingConcertBudget}
            showBooking={showBooking}
            selectedEventType={eventType}
            selectedEventDate={eventDate}
            eventLocation={eventLocation}
            clientName={name}
          />
          <MainContent
            name={artist?.name}
            code={artist?.code}
            location={artist?.location}
            events={artist?.eventsType}
            genre={artist?.genre}
            languages={artist?.languages}
            playback={artist?.playback}
            original={artist?.original}
            time={artist?.time}
            instruments={artist?.instruments}
            awards={artist?.awards}
            gallery={artist?.gallery}
            spotify={artist?.spotify}
            videos={artist?.events}
          />
        </div>
      )}
    </div>
  );
}

export default ArtistDetails;
