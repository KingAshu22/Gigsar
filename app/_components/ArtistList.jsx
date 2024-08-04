import { formatToIndianNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

function ArtistList({
  artists,
  selectedCategory,
  selectedGenre,
  selectedLocation,
  selectedEventType,
  selectedDate,
  selectedLanguage,
  selectedInstrument,
  selectedGender,
  selectedMinBudget,
  selectedMaxBudget,
  budget,
}) {
  const { toast } = useToast();
  const [contact, setContact] = useState("");

  useEffect(() => {
    const storedContact = localStorage.getItem("mobile");
    if (storedContact) {
      setContact(`+${storedContact}`);
    }
  }, []);

  const sendEnquiry = async (linkid) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/client-message`,
        {
          linkid,
          contact,
          selectedCategory,
          selectedGenre,
          selectedLocation,
          selectedEventType,
          selectedDate,
          selectedLanguage,
          selectedInstrument,
          selectedGender,
          selectedMinBudget,
          selectedMaxBudget,
        },
        { withCredentials: true }
      );
      toast({
        description: "Enquiry Send Successfully.",
      });
    } catch (error) {
      // Handle error
      console.error("Error submitting form:", error);
      toast.error("Error sending message");
    }
  };

  return (
    <div className="mb-10 px-8">
      <div
        className="grid grid-cols-2 
        sm:grid-cols-2 md:grid-cols-3
        gap-7 mt-4
         lg:grid-cols-4"
      >
        {artists.length > 0
          ? artists.map((artist, index) => {
              const eventTypeLink =
                selectedEventType.length > 0 &&
                selectedEventType !== "All Event Types"
                  ? `?selectedEventType=${selectedEventType}`
                  : "";
              return (
                <div
                  className="border-[1px] rounded-lg p-3
                  cursor-pointer hover:border-primary
                  hover:shadow-sm transition-all ease-in-out"
                  key={index}
                >
                  <Link href={`/artist/${artist.linkid}${eventTypeLink}`}>
                    <Image
                      src={artist.profilePic}
                      alt={artist.name}
                      width={350}
                      height={350}
                      className="object-cover rounded-lg"
                    />
                  </Link>
                  <div className="mt-3 items-baseline flex flex-col gap-1">
                    <h2
                      className="text-[10px] bg-blue-100 p-1 rounded-full
                        px-2 text-primary"
                    >
                      {artist.artistType}
                    </h2>
                    <h2 className="font-bold">{artist.name}</h2>
                    <h2 className="text-primary text-sm">
                      ₹{" "}
                      {budget && artist[budget]
                        ? formatToIndianNumber(artist[budget])
                        : formatToIndianNumber(artist.price)}
                    </h2>
                    <h2 className="text-gray-500 text-sm">{artist.location}</h2>
                    {contact.length > 1 && (
                      <button
                        onClick={() => sendEnquiry(artist.linkid)}
                        className="p-2 px-3 border-[1px] border-primary
                        text-primary rounded-full w-full text-center
                        text-[11px] mt-2
                        cursor-pointer 
                        hover:bg-primary hover:text-white"
                      >
                        Send enquiry
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                className="h-[220px] bg-slate-200 
              w-full rounded-lg animate-pulse"
                key={index}
              ></div>
            ))}
      </div>
    </div>
  );
}

export default ArtistList;
