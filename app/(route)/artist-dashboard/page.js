"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BadgePlus,
  CalendarDays,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [sortedLinks, setSortedLinks] = useState([]);

  useEffect(() => {
    if (user) {
      getArtist();
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      const progressBar = document.getElementById("progress-bar");
      progressBar.style.width = `${profileCompletion}%`;
    }
  }, [loading, profileCompletion]);

  const getArtist = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/artist/clerkId/${user.id}`
      );

      if (response.data && response.data.clerkId === user.id) {
        setArtist(response.data);
        calculateProfileCompletion(response.data);
        sortLinks(response.data);
      } else {
        router.push("/artist-dashboard/registration");
      }
    } catch (error) {
      console.error("Error fetching artist:", error);
      router.push("/artist-dashboard/registration");
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (artist) => {
    const fields = [
      "gallery",
      "events",
      "eventsType",
      "genre",
      "instruments",
      "time",
      "instagram",
      "facebook",
      "training",
      "blog",
    ];

    const requiredFields = [
      "gallery",
      "events",
      "eventsType",
      "genre",
      "instruments",
    ];

    const optionalFields = [
      "time",
      "instagram",
      "facebook",
      "training",
      "blog",
    ];

    const filledRequiredFields = requiredFields.filter(
      (field) => artist[field] && artist[field].length > 0
    ).length;

    const filledOptionalFields = optionalFields.every(
      (field) => artist[field] && artist[field].length > 0
    )
      ? 1
      : 0;

    const totalFields = requiredFields.length + 1; // +1 for the group of optional fields
    const filledFields = filledRequiredFields + filledOptionalFields;

    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    setProfileCompletion(completionPercentage);
  };

  const sortLinks = (artist) => {
    const links = [
      {
        field: "gallery",
        href: `${artist?.linkid}/gallery`,
        title: artist?.gallery?.length === 0 ? "Gallery" : "Edit Gallery",
        description:
          artist?.gallery?.length === 0
            ? "Upload Your Gallery Images"
            : "Edit Your Gallery Images",
        completed: artist?.gallery?.length > 0,
      },
      {
        field: "events",
        href: `${artist?.linkid}/event-videos`,
        title:
          artist?.events?.length === 0 ? "Event Videos" : "Edit Event Videos",
        description:
          artist?.events?.length === 0
            ? "Add Your Event Videos Link"
            : "Edit Your Event Videos Link",
        completed: artist?.events?.length > 0,
      },
      {
        field: "eventsType",
        href: `${artist?.linkid}/event-type`,
        title: artist?.eventsType
          ? "Edit Event Type & Budget"
          : "Event Type & Budget",
        description: artist?.eventsType
          ? "Edit your Event Types & Budget"
          : "Add your Event Types & Budget",
        completed: !!artist?.eventsType,
      },
      {
        field: "genre",
        href: `${artist?.linkid}/genre`,
        title: artist?.genre ? "Edit Genre" : "Genre",
        description: artist?.genre ? "Edit your Genre" : "Select your Genre",
        completed: !!artist?.genre,
      },
      {
        field: "instruments",
        href: `${artist?.linkid}/instruments`,
        title: artist?.instruments ? "Edit Instruments" : " Add Instruments",
        description: artist?.instruments
          ? "Edit your Instruments"
          : "Select your Instruments",
        completed: !!artist?.instruments,
      },
      {
        field: "otherDetails",
        href: `${artist?.linkid}/other-details`,
        title: "Other Details",
        description: "Add/Edit Your Other Details",
        completed: !!(
          artist?.original ||
          artist?.time ||
          artist?.awards ||
          artist?.instagram ||
          artist?.facebook ||
          artist?.youtube ||
          artist?.spotify ||
          artist?.training ||
          artist?.blog
        ),
      },
    ];

    // Sort: Incomplete links first, then complete links
    const sortedLinks = links.sort((a, b) => a.completed - b.completed);
    setSortedLinks(sortedLinks);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#dc2626" size={80} />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-5">
        Welcome Back, <span className="text-primary">{artist?.name} 👋</span>
      </h1>
      <Separator className="bg-gray-400 my-5" />

      <div className="mb-5">
        <div className="flex justify-between items-center">
          <p className="text-lg md:text-xl">Profile Completion</p>
          <p className="text-lg md:text-xl">{profileCompletion}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            id="progress-bar"
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `0%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-5">
        <Link href="/calendar">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Calendar</CardTitle>
              <CalendarDays className="hidden sm:block" />
            </CardHeader>
            <CardContent>
              <p>Manage Your Calendar</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-5">
        {sortedLinks.map((link) => (
          <Link key={link.field} href={link.href}>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{link.title}</CardTitle>
                <CalendarDays className="hidden sm:block" />
              </CardHeader>
              <CardContent>
                <p>{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
