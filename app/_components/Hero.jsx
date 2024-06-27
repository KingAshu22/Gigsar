import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import * as animationData from "../../public/musician.json";
import LottieImg from "./Lottie";

function Hero() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="desktop relative h-64 overflow-hidden rounded-lg sm:h-full lg:order-last lg:h-full">
          <LottieImg
            className="absolute inset-0 w-full h-full"
            animationData={animationData}
            width={450}
            height={450}
          />
        </div>

        <div className="mobile relative h-64 overflow-hidden rounded-lg sm:h-full lg:order-last lg:h-full">
          <LottieImg
            className="absolute inset-0 w-full h-full"
            animationData={animationData}
            width={260}
            height={260}
          />
        </div>

        <div className="flex flex-col justify-center lg:py-24">
          <h2 className="text-4xl font-bold sm:text-5xl">
            Find & Book
            <span className="text-primary"> Singers </span>
            for your
            <span className="text-primary"> Events</span>
          </h2>

          <p className="mt-4 text-gray-600">
            Discover the perfect artist for any event with Gigsar. Our advanced
            search engine makes finding and booking talented performers easier
            than ever. Transform your events with Gigsar today!
          </p>

          <Link href="/registration">
            <Button className="mt-10 bg-primary hover:bg-primary-dark text-white">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
