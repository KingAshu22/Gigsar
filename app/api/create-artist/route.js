import { mongooseConnect } from "@/lib/mongoose";
import Artist from "@/models/Artist";
import { NextRequest, NextResponse } from "next/server";

// Function to join array elements with ", " separator
function arrayToString(arr) {
  return arr.join(", ");
}

// Function to create artist profile
async function createArtistProfile(data) {
  console.log("Creating Artist Profile");
  // Process and validate data here
  // e.g., validate required fields, sanitize inputs, etc.

  // Create gallery objects
  const galleryObjects = data.gallery
    ? data.gallery.map((link) => ({ link }))
    : [];
  const events = data.youtubeLinks
    ? [
        {
          name: "Videos",
          links: data.youtubeLinks,
          type: data.youtubeLinks.map((link) =>
            link.includes("aws") ? "aws" : "youtube"
          ),
        },
      ]
    : [];

  // Create artist document
  const artistDoc = await Artist.create({
    metaTitle: data.metaTitle,
    metaDesc: data.metaDesc,
    name: data.artistName,
    linkid: data.artistName.toLowerCase().replace(/ /g, "-"),
    profilePic: data.profilePic,
    contact: data.contactNumber,
    email: data.email,
    location: data.location,
    artistType: data.artistType,
    eventsType: arrayToString(data.eventTypes),
    genre: arrayToString(data.genres),
    languages: arrayToString(data.languages),
    original: data.originalSongName,
    time: data.performanceTime,
    instruments: arrayToString(data.instruments),
    awards: data.awards,
    gallery: galleryObjects,
    events: data.events,
    blog: data.aboutArtist,
    price: data.weddingBudget,
    corporateBudget: data.corporateBudget,
    collegeBudget: data.collegeBudget,
    singerCumGuitaristBudget: data.singerCumGuitaristBudget,
    singerPlusGuitaristBudget: data.singerPlusGuitaristBudget,
    ticketingConcertBudget: data.ticketingConcertBudget,
  });

  return artistDoc;
}

export async function POST(req, res) {
  const { method, body } = req;

  try {
    await mongooseConnect();

    // Ensure method is POST
    if (method !== "POST") {
      return NextResponse.error("Method Not Allowed", { status: 405 });
    }

    // Create artist profile
    const artistDoc = await createArtistProfile(body);

    return artistDoc;

    // Return created artist document
    // return res.json(artistDoc);
  } catch (error) {
    // Handle errors
    console.error("Error creating artist profile:", error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
