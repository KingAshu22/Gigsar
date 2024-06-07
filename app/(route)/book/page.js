import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function BookArtistPage({ params }) {
  const router = useRouter();
  console.log(params);
  const artist = params.artist;
  const [event, setEvent] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (router.query.event) {
      setEvent(router.query.event);
    }
    if (router.query.price) {
      setPrice(router.query.price);
    }
  }, [router.query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book {artist}</h1>
      <p className="text-lg mb-2">Event: {event}</p>
      <p className="text-lg mb-2">Price: ₹ {price}</p>
    </div>
  );
}

export default BookArtistPage;
