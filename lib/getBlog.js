async function getBlog(linkid) {
  try {
    console.log("Inside fetchBlog");
    const response = await axios.get(`/api/blogs/${linkid}`);
    return response.json();
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to fetch blog data"); // Throw error if fetch fails
  }
}

export default getBlog;
