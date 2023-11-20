import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";

import { BlogPost } from "./BlogPostPreview";

type BlogPostCardProps = {
  post: BlogPost;
  variant?: "normal" | "small";
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
          <p className="overflow-hidden tracking-normal whitespace-nowrap overflow-ellipsis h-[29px]">
            {post.title}
          </p>
        </CardTitle>
        <p className="text-[12px]  text-blog-post-card-gray overflow-hidden whitespace-pre-wrap overflow-ellipsis h-[76px] font-sans">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
