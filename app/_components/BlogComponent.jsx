"use client";

import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import ArtistFilter from "../(route)/artist/page";

export default function BlogComponent({ linkid }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogData, setBlogData] = useState(null);
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`/api/blogs/${linkid}`);
        setBlogData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [linkid]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!blogData) {
    return <p className="text-center text-gray-700">Blog not found.</p>;
  }

  const {
    metaTitle,
    metaDescription,
    keywords,
    pageTitle,
    videos,
    content,
    link,
  } = blogData;

  // Extract query parameters from the blogData.link
  const extractFiltersFromLink = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return {
      category: urlParams.get("category") || "", // Defaults to empty string if not available
      genre: urlParams.get("genre") || "", // Defaults to empty string if not available
      location: urlParams.get("location") || "All Locations", // Default to 'All Locations'
      eventType: urlParams.get("eventType") || "", // Defaults to empty string if not available
      sortOption: urlParams.get("sortOption") || "", // Defaults to empty string if not available
    };
  };

  const filters = link && extractFiltersFromLink(link);
  console.log(filters); // Logs the extracted filters object

  return (
    <>
      <div className="mx-auto px-16 py-8">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-center mb-6 text-primary">
          {pageTitle}
        </h1>

        {link && <ArtistFilter initialFilters={filters} />}

        {/* Video Section */}
        {videos && videos.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {videos.map((video, index) => (
              <div key={index} className="w-full h-64">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${video}`}
                  width="100%"
                  height="100%"
                  controls={false}
                  light={true}
                  className="react-player"
                />
              </div>
            ))}
          </div>
        )}

        {/* Blog Content */}
        <div
          className="prose max-w-none mt-8 text-justify blog-content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </>
  );
}
