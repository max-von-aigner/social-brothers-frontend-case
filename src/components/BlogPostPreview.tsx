import BlogPostCard from "./BlogPostCard";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/shadcn/ui/button";

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

interface BlogPostPreviewProps {}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = () => {
  const postsPerPage: number = 4;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      // Filter out duplicate posts before updating the state
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

  const handleLoadMore = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchPosts(nextPage); // Fetch new posts with the updated page value
      return nextPage; // Return the updated page value
    });
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]); // Fetch initial posts and update posts when the page changes

  return (
    <div className="flex flex-col justify-between bg-white p-[24px] w-[642px] min-h-[659px] my-[64px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
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
