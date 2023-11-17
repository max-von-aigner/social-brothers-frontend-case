import Header from "@/components/Header";
import BlogPostForm from "@/components/BlogPostForm";
import BlogPostPreview from "@/components/BlogPostPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-neutral-50">
      <div className="flex justify-center mx-auto">
        <Header />
      </div>
      <div className="flex justify-center gap-10 mx-auto">
        <BlogPostForm />
        <BlogPostPreview />
      </div>
      <div className="flex justify-center mx-auto">
        <Footer />
      </div>
    </main>
  );
}
