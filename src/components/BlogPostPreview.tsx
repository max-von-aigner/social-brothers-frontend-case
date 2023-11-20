import BlogPostCard from "./BlogPostCard";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/shadcn/ui/button";

// Define types for blog post category and blog post
export type BlogPostCategory = {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
};

export type BlogPost = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  category_id: number;
  img_url: string;
  category: BlogPostCategory;
};

// Define props for the BlogPostPreview component
interface BlogPostPreviewProps {}

// BlogPostPreview component
const BlogPostPreview: React.FC<BlogPostPreviewProps> = () => {
  // Constants and state hooks for pagination and data
  const postsPerPage: number = 4;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch blog posts from the API
  const fetchPosts = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/getPosts`, {
        params: {
          page: currentPage,
          perPage: postsPerPage,
          sortBy: "created_at",
          sortDirection: "desc",
        },
      });

      console.log("API Response:", response.data);

      // Update the state with new posts, avoiding duplicates
      setPosts((prevPosts) => {
        const newPosts = response.data.data.filter(
          (newPost: BlogPost) =>
            !prevPosts.some((prevPost) => prevPost.id === newPost.id)
        );
        return [...prevPosts, ...newPosts];
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Event handler for loading more posts
  const handleLoadMore = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchPosts(nextPage);
      return nextPage;
    });
  };

  // Fetch initial posts on component mount and when the page changes
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // Render the component
  return (
    <div className="flex flex-col justify-between bg-white p-[24px] w-[642px] min-h-[659px] my-[64px] overflow-y-auto">
      {/* Grid of BlogPostCard components */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      {/* Loading indicator or Load More button */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            className="btn-load-more rounded-full bg-custom-orange h-[39px] w-[158px] text-[12px]"
          >
            Laad meer
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPostPreview;
