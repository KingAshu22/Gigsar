"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import ReactPlayer from "react-player";

export default function BlogPage({ params }) {
  const { linkid } = params;
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${linkid}`);
        setBlogData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
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

  const { metaTitle, metaDescription, keywords, pageTitle, videos, content } =
    blogData;

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>{metaTitle || "Blog Page"}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
        {keywords && <meta name="keywords" content={keywords} />}
        {/* Open Graph Tags */}
        <meta property="og:title" content={metaTitle || "Blog Page"} />
        <meta property="og:description" content={metaDescription || ""} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://yourwebsite.com/blogs/${linkid}`}
        />
        <meta
          property="og:image"
          content="https://yourwebsite.com/og-image.jpg"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto px-16 py-8">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-center mb-6 text-primary">
          {pageTitle}
        </h1>

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
