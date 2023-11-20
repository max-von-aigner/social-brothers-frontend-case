import Header from "@/components/Header";
import BlogPostForm from "@/components/BlogPostForm";
import BlogPostPreview from "@/components/BlogPostPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-50">
      <div className="flex justify-center">
        <Header />
      </div>
      <div className="flex justify-center gap-10 mx-auto">
        <BlogPostForm />
        <BlogPostPreview />
      </div>
      <div className="flex-col justify-center">
        <Footer />
      </div>
    </main>
  );
}
