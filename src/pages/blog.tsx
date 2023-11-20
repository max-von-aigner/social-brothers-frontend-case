import Header from "@/components/Header";
import BlogArchive from "@/components/BlogArchive";
import Footer from "@/components/Footer";
const BlogPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header>
        <h1>Blog</h1>
      </Header>
      <div className="flex items-center flex-grow">
        {/* Content area, adjust as needed */}
        <BlogArchive />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
