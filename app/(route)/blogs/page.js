"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs");
        setBlogs(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center text-xl py-10">Loading blogs...</div>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Our Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog.linkid}`} key={blog._id}>
            <div className="cursor-pointer p-6 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-2">{blog.pageTitle}</h2>
              <p
                className="text-gray-600 mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    blog.content.length > 100
                      ? blog.content.substring(0, 250) + "..."
                      : blog.content,
                }}
              ></p>
              <p className="text-indigo-500 font-medium">Read More &rarr;</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
