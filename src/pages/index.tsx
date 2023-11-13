import Header from "@/components/Header";
import BlogPostForm from "@/components/BlogPostForm";
import BlogPostPreview from "@/components/BlogPostPreview";

export default function Home() {
  return (
    <main className="bg-neutral-50">
      <Header />
      <div className="flex">
        <BlogPostForm />
        <BlogPostPreview />
      </div>
    </main>
  );
}
