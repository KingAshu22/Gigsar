"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
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
        }}
        plugins={[autoplayPlugin.current]}
      >
        <CarouselContent>
          {[
            { href: "singer-for-house-party", src: "/carousel-1.png" },
            { href: "singer-for-house-party", src: "/carousel-1.png" },
            { href: "singer-for-house-party", src: "/carousel-1.png" },
          ].map((slide, index) => (
            <CarouselItem key={index} className="w-full">
              <Link href={`/${slide.href}`}>
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
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
        {[
          { href: "Corporate", label: "Corporate Event" },
          { href: "College", label: "College Event" },
          { href: "Wedding", label: "Wedding Event" },
          { href: "House", label: "House Party" },
          { href: "Virtual", label: "Virtual Event" },
        ].map((event, index) => (
          <Link key={index} href={`/?eventType=${event.href}`}>
            <div className="rounded-lg bg-primary w-full h-32 flex items-center justify-center text-white text-lg font-bold text-center p-2">
              {event.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
