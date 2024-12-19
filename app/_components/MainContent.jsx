"use client";

import React, { useState } from "react";
import About from "./About";
import MainMenu from "./MainMenu";
import {
  Clapperboard,
  Disc3,
  Drum,
  Hash,
  Languages,
  MapPin,
  Music,
  Ticket,
  Timer,
  Trophy,
} from "lucide-react";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { formatToIndianNumber } from "@/lib/utils";

const MainContent = ({
  name,
  code,
  location,
  events,
  genre,
  languages,
  playback,
  original,
  time,
  instruments,
  awards,
  gallery,
  spotify,
  videos,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedimg, setSelectedimg] = useState(null);

  const openModal = (image) => {
    setSelectedimg(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedimg(null);
    setModalOpen(false);
  };
  return (
    <div className="col-span-12 lg:col-span-9 rounded-2xl">
      <div className="tab_item bg-slate-100 dark:bg-[#111111] rounded-xl mb-14">
        <div className="pt-4 px-4 mt-6">
          <div>
            <h2 className="text-2xl text-slate-900 dark:text-slate-50 font-bold mb-2">
              About Me
            </h2>
            <div className="grid gap-2 grid-cols-3 md:grid-cols-3">
              <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Hash />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Code
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {code}
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <MapPin />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Location
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {location}
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Timer />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Time
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {time} Mins
                  </p>
                </div>
              </div>
              {/* <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Ticket />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Events
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {events}
                  </p>
                </div>
              </div> */}
              {/* <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Music />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Genre
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {genre}
                  </p>
                </div>
              </div> */}
              <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Languages />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Languages
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {languages}
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Clapperboard />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Playback
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {playback}
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Disc3 />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Originals
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {original}
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Drum />
                </div>
                <div>
                  <h4 className="dark:text-white text-xs md:text-xl font-semibold">
                    Instruments
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {instruments}
                  </p>
                </div>
              </div>
              {/* <div className="p-2 rounded-md border border-slate-200 dark:border-slate-800 flex justify-items-center content-center items-center gap-1 md:gap-5">
                <div>
                  <Trophy />
                </div>
                <div>
                  <h4 className="dark:text-white text-xl font-semibold">
                    Awards
                  </h4>
                  <p className="text-xs md:text-xl text-gray-lite dark:text-[#A6A6A6]">
                    {awards}
                  </p>
                </div>
              </div> */}
            </div>
            <h3 className="text-2xl text-slate-900 dark:text-slate-50 font-bold py-4">
              Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {gallery?.map((link, index) => (
                <div key={index} className="w-full">
                  <img
                    src={link.link}
                    width={200}
                    height={200}
                    alt={`Hire ${name} from Gigsar`}
                    className="border rounded-lg object-cover cursor-pointer"
                    onClick={() => openModal(link.link)}
                  />
                </div>
              ))}
            </div>
            {spotify && (
              <>
                <h3 className="text-2xl text-slate-900 dark:text-slate-50 font-bold py-4">
                  Latest Songs
                </h3>
                <iframe
                  className="rounded-lg"
                  src={spotify}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </>
            )}
            <h3 className="text-4xl text-slate-900 dark:text-slate-50 font-semibold pt-6 pb-4">
              Videos
            </h3>
            <div className="">
              {videos?.map((event, index) => {
                const hasAvailableLinks = event.links.some(
                  (link) => link.length > 0
                );

                return (
                  <div key={index}>
                    {hasAvailableLinks && (
                      <>
                        <h3 className="font-semibold text-xs md:text-xl text-gray-700 mb-2">
                          {event.name}
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {event.links.map(
                            (link, linkIndex) =>
                              link.length > 0 && (
                                <div key={linkIndex} className="w-full h-64">
                                  <ReactPlayer
                                    url={`https://www.youtube.com/watch?v=${link}`}
                                    className="react-player"
                                    controls={false}
                                    light={true}
                                    width="100%"
                                    height="72%"
                                  />
                                </div>
                              )
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={`${name} Image`}>
        <div className="flex justify-center">
          <img
            src={selectedimg}
            width={400}
            height={400}
            alt={`Hire ${name} from Gigsar`}
            className="border rounded-lg object-contain"
          />
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MainContent;
