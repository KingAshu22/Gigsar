"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <div className="p-4">
      {/* Carousel Section */}
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "start", // Ensures multiple slides are aligned
        }}
        plugins={[autoplayPlugin.current]}
      >
        <CarouselContent>
          {[
            { href: "singer-for-house-party", src: "/carousel-1.png" },
            { href: "https://artist.gigsar.com", src: "/carousel-2.png" },
            { href: "/", src: "/carousel-3.png" },
          ].map((slide, index) => (
            <CarouselItem
              key={index}
              className="w-full md:basis-1/2" // Shows 2 slides in medium+ screens
            >
              <Link
                href={slide.href}
                target={slide.href.startsWith("http") ? "_blank" : "_self"}
              >
                <Image
                  src={slide.src}
                  width={1920}
                  height={600}
                  className="w-full h-auto rounded-3xl"
                  alt="Promo"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <h1 className="text-2xl font-bold mt-6">Artists</h1>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:flex lg:flex-row">
        {[
          { href: "singer-band", src: "/artist-type/Singer.png" },
          { href: "instrumentalist", src: "/artist-type/musician.png" },
          { href: "dj", src: "/artist-type/dj.png" },
          { href: "comedian", src: "/artist-type/comedian.png" },
          { href: "rapper", src: "/artist-type/rapper.png" },
        ].map((artist, index) => (
          <Link key={index} href={`/?category=${artist.href}`}>
            <Image
              src={artist.src}
              width={300}
              height={300}
              className="rounded-lg w-full"
              alt="Artist"
            />
          </Link>
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-6">Events Type</h1>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full justify-items-center">
        {[
          {
            href: "Corporate",
            src: "/event-type/corporate.gif",
            label: "Corporate Event",
          },
          {
            href: "College",
            src: "/event-type/college.gif",
            label: "College Event",
          },
          {
            href: "Wedding",
            src: "/event-type/wedding.gif",
            label: "Wedding Event",
          },
          { href: "House", src: "/event-type/house.gif", label: "House Party" },
          {
            href: "Virtual",
            src: "/event-type/virtual.gif",
            label: "Virtual Event",
          },
        ].map((event, index) => (
          <Link key={index} href={`/?eventType=${event.href}`}>
            <div className="rounded-lg w-full flex flex-col items-center justify-center text-lg font-bold text-center">
              <Image
                src={event.src}
                width={1280}
                height={720}
                className="rounded-lg border-2 border-gray-200 py-2"
                alt="Event"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
