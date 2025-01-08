import BlogComponent from "@/app/_components/BlogComponent";
import getBlog from "@/lib/getBlog";
import axios from "axios";

export async function generateMetaData({ params }) {
  const { linkid } = params;
  const blogData = await getBlog(linkid); // Await the fetchBlog function here

  return {
    title: blogData?.metaTitle + " | Gigsar",
    description: blogData?.metaDescription,
    keywords: blogData?.keywords,
    openGraph: {
      title: blogData?.metaTitle,
      description: blogData?.metaDescription,
      url: `https://www.gigsar.com/blogs/${blogData?.linkid}`,
      siteName: "Gigsar",
      locale: "en_IN",
      type: "website",
    },
  };
}
export const metaData = {
  title: "Blog Page",
  description: "This is the blog page",
};

export const viewport = {
  themeColor: "#F44336",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const fetchBlog = async (linkid) => {
  try {
    console.log("Inside fetchBlog");
    const response = await axios.get(`/api/blogs/${linkid}`);
    return response.data;
    console.log(response.data);
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to fetch blog data"); // Throw error if fetch fails
  }
};

export default function BlogPage({ params }) {
  const { linkid } = params;

  return <BlogComponent linkid={linkid} />;
}
