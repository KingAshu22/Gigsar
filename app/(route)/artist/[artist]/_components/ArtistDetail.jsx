import { Button } from "@/components/ui/button";
import {
  Clock,
  GraduationCap,
  Guitar,
  MapPin,
  Music,
  Star,
  Type,
  User,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import BookAppointment from "./BookArtist";
import ReactPlayer from "react-player/lazy";

function ArtistDetail({ artist }) {
  const socialMediaList = [
    {
      id: 1,
      icon: "/youtube.png",
      url: "",
    },
    {
      id: 2,
      icon: "/linkedin.png",
      url: "",
    },
    {
      id: 3,
      icon: "/twitter.png",
      url: "",
    },
    {
      id: 4,
      icon: "/facebook.png",
      url: "",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 border-[1px] p-5 mt-5 rounded-lg">
        {/* Artist Image  */}
        <div>
          <Image
            src={artist.profilePic}
            width={200}
            height={200}
            alt={artist.name}
            className="border-[1px] rounded-lg w-full h-[280px] object-cover"
          />
        </div>
        {/* Doctor Info  */}
        <div className="col-span-2 md:px-10 mt-5 flex flex-col gap-3 items-baseline">
          <h2 className="font-bold text-2xl">{artist.name}</h2>

          {/* Container for the two columns */}
          <div className="md:flex md:gap-10">
            {/* First Column */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center text-gray-500 text-md">
                <User className="bg-gray-200 rounded-lg p-2 size-10" />
                <span className="text-sm">{artist.code}</span>
              </div>
              <div className="flex gap-2 items-center text-gray-500 text-md">
                <Music className="bg-gray-200 rounded-lg p-2 size-10" />
                <span className="capitalize">Genre: {artist.genre}</span>
              </div>
              <div className="flex gap-2 items-center text-gray-500 text-md">
                <Star className="bg-gray-200 rounded-lg p-2 size-10" />
                <span>8.5/10</span>
              </div>
              <div className="text-md flex gap-2 items-center text-gray-500">
                <MapPin className="bg-gray-200 rounded-lge p-2 size-10" />
                <span className="capitalize">{artist.location}</span>
              </div>
            </div>

            {/* Second Column */}
            <div className="flex flex-col gap-2">
              <div className="text-md flex gap-2 items-center text-gray-500">
                <Type className="bg-gray-200 rounded-lg p-2 size-10" />
                <span className="capitalize">Type: {artist.artistType}</span>
              </div>
              <div className="flex gap-2 items-center text-gray-500 text-md">
                <Guitar className="bg-gray-200 rounded-lg p-2 size-10" />
                <span className="capitalize">
                  Instruments: {artist.instruments}
                </span>
              </div>
              <div className="flex gap-2 items-center text-gray-500 text-md">
                <GraduationCap className="bg-gray-200 rounded-lg p-2 size-10" />
                <span>10+ Years of Experience</span>
              </div>
              <div className="flex gap-2 items-center text-gray-500 text-md">
                <Clock className="bg-gray-200 rounded-lg p-2 size-10" />
                <span>Duration: {artist.time}</span>
              </div>
            </div>
          </div>

          <h2 className="font-bold text-xl p-1 rounded-full px-2 ">₹9,999/-</h2>

          {/* <div className="flex gap-3">
            {socialMediaList.map((item, index) => (
              <Image src={item.icon} key={index} width={30} height={30} />
            ))}
          </div> */}

          <BookAppointment artist={artist} />
        </div>

        {/* About Artist  */}
      </div>
      <div className="p-3 border-[1px] rounded-lg mt-5">
        <h2 className="font-bold text-[30px]">Videos</h2>
        <div className="mt-2 mx-4 my-4">
          {artist.events.map((event, index) => (
            <div key={index}>
              <h2>{event.name}</h2>
              {/* Grid container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {event.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="w-full h-full mx-4 my-4 mb-8">
                    <ReactPlayer
                      url={"https://www.youtube.com/watch?v=" + link}
                      className="react-player" // Add custom class for potential styling
                      width="100%" // Ensures ReactPlayer takes the full width of the parent div
                      height="100%" // Adjust height accordingly, might require specific values or adjustments
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <h2 className="font-bold text-[20px]">About Me</h2>
        <div
          className="text-gray-500 tracking-wide mt-2 mx-4 my-4 text-justify"
          dangerouslySetInnerHTML={{ __html: artist.blog }}
        ></div>
      </div>
    </>
  );
}

export default ArtistDetail;
