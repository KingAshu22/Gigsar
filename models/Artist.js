import mongoose, { Schema, model, models } from "mongoose";

const ArtistSchema = new Schema({
  metaTitle: String,
  metaDesc: String,
  keywords: String,
  linkid: String,
  name: String,
  profilePic: String,
  contact: String,
  email: String,
  location: String,
  price: String,
  artistType: String,
  bandMemberName: String,
  code: String,
  eventsType: String,
  genre: String,
  languages: String,
  playback: String,
  original: String,
  time: String,
  instruments: String,
  awards: String,
  spotify: String,
  gallery: Array,
  events: Array,
  testLinks: Array,
  reviews: Array,
  blog: String,
  contactVisibility: {
    email: Boolean,
    call: Boolean,
    whatsapp: Boolean,
    enquiryOnly: Boolean,
  },
});

const Artist = models.Artist || model("Artist", ArtistSchema);

export default Artist;
