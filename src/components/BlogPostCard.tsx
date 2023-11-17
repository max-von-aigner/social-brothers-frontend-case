import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";

import { BlogPost } from "./BlogPostPreview"; // imported type

type BlogPostCardProps = {
  post: BlogPost;
  variant?: "normal" | "small"; // Accept variant prop for different sizes in Homepage and Blogpage
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = "normal",
}) => {
  // Format the date to MM-DD-YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const formattedDate = formatDate(post.created_at);

  // Define the width based on the variant
  const widthClass = variant === "small" ? "w-[261px]" : "w-[285px]";

  return (
    <Card className={`bg-white shadow rounded-none ${widthClass}`}>
      <CardHeader
        className="relative h-[72px] px-[16px] pb-[8px]"
        style={{
          backgroundImage: `url('/assets/blog-post-card-mask.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="left-0 bottom-0 absolute text-[8px] font-sans text-white px-[16px] italic">
          {formattedDate}
        </p>

        <p className="right-0 bottom-0 absolute text-[8px] font-sans text-white px-[16px] italic">
          {post.category.name}
        </p>
      </CardHeader>
      <CardContent className="p-[16px] overflow-hidden">
        <CardTitle className="font-sans font-bold text-neutral-800">
          {/* Apply ellipsis to the title using Tailwind classes */}
          <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
            {post.title}
          </p>
        </CardTitle>
        {/* Apply ellipsis to the content using Tailwind classes */}
        <p className="text-[12px] mt-[8px] text-blog-post-card-gray overflow-hidden whitespace-pre-wrap overflow-ellipsis h-[76px]">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
