"use client";
import ArtistFilter from "./(route)/artist/page";
import Stats from "./_components/Stats";

export default function Home() {
  return (
    <div>
      <ArtistFilter />
      {/* <Stats /> */}
      <footer className="bg-gray-800 text-white text-center p-6">
        <p>
          &copy; {new Date().getFullYear()} Gigsar.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
