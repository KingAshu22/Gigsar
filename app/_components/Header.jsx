"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlignJustify,
  CircleUser,
  LogOut,
  MessageCircleMore,
  MessagesSquare,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/hook";
import axios from "axios";
import Modal from "./Modal";

const Header = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [shortName, setShortName] = useState("");
  const [client, setClient] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(useAuth());
  const router = useRouter();

  useEffect(() => {
    const storedNumber = localStorage?.getItem("mobile");
    console.log("Stored Number:", storedNumber);

    if (storedNumber !== undefined) {
      setMobileNumber(JSON?.parse(storedNumber));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (mobileNumber) {
      getClient();
    }
  }, [mobileNumber]);

  const getClient = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/client/contact/+${mobileNumber}`
      );

      if (response.data) {
        const name = response.data.name;

        console.log(response.data);

        // Get initials (e.g., KP for Krishna Pandey)
        const initials = name
          .split(" ") // Split the name into an array of words
          .map((word) => word[0]) // Take the first letter of each word
          .join("") // Join the letters to form initials
          .toUpperCase(); // Ensure it's in uppercase

        setShortName(initials); // Set the short name as initials
        setClient(response.data);
      }
    } catch (error) {
      console.error("Error fetching Client:", error);
    } finally {
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const mobile = localStorage.getItem("mobile");
      const authExpiry = localStorage.getItem("authExpiry");
      if (mobile && authExpiry && Date.now() < parseInt(authExpiry, 10)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, 2000); // Set the interval to run every 2000ms (2 seconds)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Pass an empty array as the second argument

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("mobile");
    localStorage.removeItem("authExpiry");
    window.dispatchEvent(new Event("storage")); // Trigger storage event manually
    window.location.reload(); // Force a page refresh
  }, [router]);

  const Menu = [{ id: 1, name: "Contact", path: "/contact-and-support" }];

  return (
    <>
      <div className="flex items-center justify-between p-4 shadow-sm bg-white">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex flex-row">
            <h1 className="font-bold text-3xl text-primary">Gigsar </h1>
            <span className="font-bold">®</span>
          </Link>
          <ul className="hidden md:flex gap-8">
            {Menu.map((item, index) => (
              <Link href={item.path} key={index}>
                <li className="text-[#4A5E8B] hover:text-primary cursor-pointer hover:scale-105 transition-all ease-in-out text-sm">
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        {isMounted && (
          <div className="flex items-center gap-8 md:justify-end">
            <div className="hidden md:flex gap-2">
              <a href={"https://artist.gigsar.com"}>
                <div className="flex flex-row items-center gap-1 bg-[#4A5E8B] px-2 text-white p-1 rounded-md">
                  Artist Login
                </div>
              </a>
              <a href={"/chat"}>
                <div className="flex flex-row items-center gap-1 bg-[#4A5E8B] text-white p-1 rounded-md text-sm">
                  Message <MessageCircleMore />
                </div>
              </a>
              <a href={"/user-dashboard"}>
                <div className="flex flex-row items-center gap-1 bg-[#4A5E8B] px-2 text-white p-1 rounded-md">
                  User Login
                </div>
              </a>
            </div>
            <Popover className="md:hidden">
              <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0 md:hidden">
                  <AlignJustify className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <ul className="flex flex-col gap-4 p-2">
                  {Menu.map((item, index) => (
                    <Link href={item.path} key={index}>
                      <li className="hover:text-primary cursor-pointer hover:scale-105 transition-all ease-in-out">
                        {item.name}
                      </li>
                    </Link>
                  ))}
                  <a href={"https://artist.gigsar.com"}>
                    <div className="flex flex-row items-center gap-1 bg-[#4A5E8B] px-2 text-white p-1 rounded-md">
                      Artist Login
                    </div>
                  </a>
                  <a href={"/chat"}>
                    <div className="flex flex-row items-center gap-1 bg-[#4A5E8B] text-white p-1 rounded-md text-sm">
                      Message <MessageCircleMore />
                    </div>
                  </a>
                  <a href={"/user-dashboard"}>
                    <div className="flex flex-row items-center gap-1 bg-[#4A5E8B] px-2 text-white p-1 rounded-md">
                      User Login
                    </div>
                  </a>
                </ul>
              </PopoverContent>
            </Popover>
            <div>
              {isAuthenticated && (
                <Avatar
                  className="cursor-pointer"
                  onClick={() => {
                    setShowProfile(true);
                  }}
                >
                  <AvatarFallback>{shortName}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={showProfile}
        onClose={() => {
          setShowProfile(false);
        }}
        title="Artist Details"
      >
        <div className="flex flex-col items-center space-y-6 p-6 relative">
          {/* Profile Picture */}
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-gray-300 shadow-lg">
              <AvatarFallback className="bg-gray-200 text-xl font-bold">
                {shortName}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Artist Details */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-gray-800">
              {client?.name}
            </h3>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Role</span>:{" "}
              {client?.type
                ?.split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
            <p className="text-sm text-gray-500">
              {" "}
              <span className="font-semibold">Mobile</span>: {client?.contact}
            </p>
            <p className="text-sm text-gray-500">
              {" "}
              <span className="font-semibold">Email</span>: {client?.email}
            </p>
          </div>

          {/* Sign Out Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="bg-primary text-white">
                <LogOut className="w-6 h-6" /> Sign Out
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <p>Are you sure you want to sign out?</p>
                <Button onClick={handleSignOut} className="mt-2">
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Modal>
    </>
  );
};

export default Header;
