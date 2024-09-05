"use client";
import ArtistFilter from "./(route)/artist/page";
import MyBot from "./_components/MyBot";

export default function Home() {
  return (
    <div>
      {/* Hero Section  */}
      {/* <Hero /> */}
      <MyBot />
      {/* Popular Artists List  */}
      <ArtistFilter />
    </div>
  );
}
