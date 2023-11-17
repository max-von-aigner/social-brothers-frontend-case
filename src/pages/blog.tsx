import Header from "@/components/Header";
import BlogArchive from "@/components/BlogArchive";
const blogPage = () => {
  return (
    <>
      <div className="flex mx-auto justify-center">
        <Header />
      </div>
      <BlogArchive />
    </>
  );
};

export default blogPage;
