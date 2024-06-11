"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Script from "next/script";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn, formatToIndianNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import soundSystems from "./components/soundSystems";
import addOns from "./components/addOns";

const eventTypeMapping = {
  Corporate: "corporateBudget",
  College: "collegeBudget",
  Wedding: "price",
  Reception: "price",
  Haldi: "price",
  Mehendi: "price",
  "Mayra/Bhaat": "price",
  "Musical/Vedic Pheras": "price",
  Sangeet: "price",
  "House Party": "singerCumGuitaristBudget",
  "Ticketing Concert": "ticketingConcertBudget",
  Virtual: "singerCumGuitaristBudget",
};

function BookArtistPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);

  const artistName = params.artist.replace(/-/g, " ");
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState("");
  const [priceName, setPriceName] = useState("");
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [selectedSoundSystem, setSelectedSoundSystem] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [artistPrice, setArtistPrice] = useState("");

  useEffect(() => {
    getArtist();
  }, []);

  useEffect(() => {
    const eventParam = searchParams.get("event");
    if (eventParam) {
      setEvent(eventParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (artist && event) {
      const priceName = eventTypeMapping[event] || "";
      setPriceName(priceName);
      setArtistPrice(artist[priceName]);
    }
  }, [artist, event]);

  const getArtist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/artist/artistName/` + params.artist
      );
      setArtist(response.data);
    } catch (error) {
      console.error("Error fetching artist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const initAutocomplete = () => {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["(cities)"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setLocation(place.formatted_address);
          }
        });
      };

      if (typeof google !== "undefined" && google.maps) {
        initAutocomplete();
      }
    }
  }, [location]);

  const handleGuestsChange = (value) => {
    setGuestCount(value);
    const system = soundSystems.find((system) => system.guests === value);
    if (system) {
      setSelectedSoundSystem(system.id);
    } else {
      setSelectedSoundSystem(null);
    }
  };

  const handleAddOnsChange = (id) => {
    setSelectedAddOns((prev) =>
      prev.includes(id)
        ? prev.filter((addOnId) => addOnId !== id)
        : [...prev, id]
    );
  };

  const calculatePrices = () => {
    const soundSystem = soundSystems.find(
      (system) => system.id === selectedSoundSystem
    );
    const addOnPrices = selectedAddOns.map(
      (id) => parseFloat(addOns.find((addOn) => addOn.id === id)?.price) || 0
    );

    const soundSystemPrice = soundSystem ? parseFloat(soundSystem.price) : 0;
    const addOnsTotalPrice = addOnPrices.reduce(
      (total, price) => total + price,
      0
    );
    const subtotal =
      parseFloat(artistPrice) + soundSystemPrice + addOnsTotalPrice;

    const gst = Number.isFinite(subtotal) ? (subtotal * 18) / 100 : 0;
    const total = Number.isFinite(subtotal) ? subtotal + gst : 0;

    return { subtotal, gst, total };
  };

  const { subtotal, gst, total } = calculatePrices();

  return (
    <div className="container mx-auto p-4">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => {
          if (inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(
              inputRef.current,
              {
                types: ["(cities)"],
              }
            );

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (place.geometry) {
                setLocation(place.formatted_address);
              }
            });
          }
        }}
      />
      <h1 className="text-3xl font-bold mb-4 text-center">
        Book <span className="capitalize">{artist?.name}</span> for {event}{" "}
        Event
      </h1>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="mb-4 flex-1">
          <Label htmlFor="location">Event Location</Label>
          <div className="relative">
            <Input
              id="location"
              type="text"
              value={location}
              ref={inputRef}
              autoComplete="off"
              className="w-full"
              placeholder="Enter city name"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4 flex-1">
          <Label htmlFor="date">Event Date</Label>
          <br />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="mb-4 flex-1">
          <Label htmlFor="guests">Number of Guests</Label>
          <Select onValueChange={handleGuestsChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Number of Guests?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Up to 10">Up to 10</SelectItem>
              <SelectItem value="11 to 20">11 to 20</SelectItem>
              <SelectItem value="21 to 50">21 to 50</SelectItem>
              <SelectItem value="51 to 80">51 to 80</SelectItem>
              <SelectItem value="81 to 120">81 to 120</SelectItem>
              <SelectItem value="121 to 200">121 to 200</SelectItem>
              <SelectItem value="More than 200">More than 200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-8">
        <Label htmlFor="soundSystem" className="block mb-2">
          Select Sound System
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {soundSystems.map((system) => (
            <div
              key={system.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedSoundSystem === system.id
                  ? "border-primary"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedSoundSystem(system.id)}
            >
              <h2 className="text-xl font-bold mb-2">{system.name}</h2>
              <p
                className="text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: system.specs }}
              ></p>
              <p className="text-sm mb-1">
                <span className="font-bold">Suitable Guest Count:</span>{" "}
                {system.guests}
              </p>
              <p className="text-sm mb-1">
                <span className="font-bold">Suitable Event Type:</span>{" "}
                {system.suitable}
              </p>
              <p className="text-lg font-semibold text-primary">
                Price: {system.price}/-
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <Label htmlFor="addOns" className="block mb-2">
          Any Add On?
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addOns.map((addOn) => (
            <div
              key={addOn.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedAddOns.includes(addOn.id)
                  ? "border-primary"
                  : "border-gray-300"
              }`}
              onClick={() => handleAddOnsChange(addOn.id)}
            >
              <h2 className="text-xl font-bold mb-2">{addOn.name}</h2>
              <p
                className="text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: addOn.specs }}
              ></p>
              <p className="text-lg font-semibold text-primary">
                Price: {addOn.price}/-
              </p>
              <div className="mt-2">
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(addOn.id)}
                  onChange={() => handleAddOnsChange(addOn.id)}
                />
                <label className="ml-2">{addOn.name}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Pricing Details</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            {/* Artist Price */}
            <div className="flex justify-between">
              <p className="text-lg">
                <span className="font-bold">Artist Price:</span>
              </p>
              <p className="text-lg">₹{formatToIndianNumber(artistPrice)}</p>
            </div>

            {/* Sound System Price */}
            {selectedSoundSystem && (
              <div className="flex justify-between">
                <p className="text-lg">
                  <span className="font-bold">Sound System Price:</span>
                </p>
                <p className="text-lg">
                  ₹
                  {formatToIndianNumber(
                    soundSystems.find(
                      (system) => system.id === selectedSoundSystem
                    )?.price || 0
                  )}
                </p>
              </div>
            )}

            {/* Add-Ons Price */}
            <div className="flex justify-between">
              <p className="text-lg">
                <span className="font-bold">Add-Ons Price:</span>
              </p>
              <p className="text-lg">
                ₹
                {formatToIndianNumber(
                  selectedAddOns
                    .map(
                      (id) =>
                        addOns.find((addOn) => addOn.id === id)?.price || 0
                    )
                    .reduce((total, price) => total + price, 0)
                )}
              </p>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between">
              <p className="text-lg">
                <span className="font-bold">Subtotal:</span>
              </p>
              <p className="text-lg">₹{formatToIndianNumber(subtotal)}</p>
            </div>

            {/* GST */}
            <div className="flex justify-between">
              <p className="text-lg">
                <span className="font-bold">GST (18%):</span>
              </p>
              <p className="text-lg">₹{formatToIndianNumber(Math.ceil(gst))}</p>
            </div>

            {/* Total */}
            <div className="flex justify-between">
              <p className="text-xl font-bold">
                <span className="text-primary">Total:</span>
              </p>
              <p className="text-xl font-bold">
                ₹{formatToIndianNumber(Math.ceil(total))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookArtistPage;
