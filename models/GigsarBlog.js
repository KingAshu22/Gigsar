import mongoose, { Schema, model, models } from "mongoose";
const GigsarBlogSchema = new Schema({
  metaTitle: String,
  metaDescription: String,
  keywords: String,
  linkid: String,
  pageTitle: String,
  videos: Array,
  content: String,
});
const GigsarBlog = models.GigsarBlog || model("GigsarBlog", GigsarBlogSchema);
export default GigsarBlog;
