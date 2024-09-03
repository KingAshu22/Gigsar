"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function BlogPage({ params }) {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the blog data using the URL
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/gigsar-fetch-blog`, {
        params: { url: params.url },
      })
      .then((response) => {
        setBlogData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog data:", err);
        setError("Could not load the blog. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {blogData ? (
        <>
          <h1>{blogData.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: blogData.content }} />
        </>
      ) : (
        <p>Blog not found.</p>
      )}
    </div>
  );
}
