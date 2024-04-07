import Image from "next/image";
import Link from "next/link";

export default function BookPage() {
  return (
    <>
      <section id="artistSection">
        <h1>Select Artist Type</h1>
        <div className="grid grid-cols-4 mt-5 md:grid-cols-4 lg:grid-cols-4 ">
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/singer.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">Singer</label>
          </div>
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/band.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">Bands</label>
          </div>
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/musician.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">Musician</label>
          </div>
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/dj.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">DJ</label>
          </div>
        </div>
      </section>
      <section id="eventSection">
        <h1>Select Event Type</h1>
        <div className="grid grid-cols-4 mt-5 md:grid-cols-4 lg:grid-cols-4 ">
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/singer.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">Singer</label>
          </div>
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/band.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">Bands</label>
          </div>
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/musician.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">Musician</label>
          </div>
          <div
            className="flex flex-col text-center items-center
          p-5 bg-blue-50 m-2 rounded-lg cursor-pointer
          gap-2 hover:scale-110 transition-all ease-in-out"
          >
            <Image
              src="/artist-type/dj.svg"
              alt="icon"
              width={40}
              height={40}
            />
            <label className="text-primary text-sm">DJ</label>
          </div>
        </div>
      </section>
    </>
  );
}
