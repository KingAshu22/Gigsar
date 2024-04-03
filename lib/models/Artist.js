import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  metaTitle: String,
  metaDesc: String,
  keywords: String,
  linkid: String,
  name: String,
  profilePic: String,
  contact: String,
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
});

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
