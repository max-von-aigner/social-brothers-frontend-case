import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import BlogPostCard from "./BlogPostCard";
import { BlogPost } from "./BlogPostPreview";

type SortOption = "recent" | "title";
type FilterOption =
  | "all"
  | "category1"
  | "category2"
  | "category3"
  | "category4";

const BlogArchive: React.FC = () => {
  const postsPerPage: number = 8;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value as FilterOption);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/getPosts`, {
          params: {
            page: currentPage + 1,
            perPage: postsPerPage,
            sortBy: sortOption === "recent" ? "created_at" : "title",
            sortDirection: "desc", // For recent posts, use descending order
            searchPhrase: "",
            categoryId:
              filterOption === "all"
                ? undefined
                : getCategoryByFilterOption(filterOption),
          },
        });

        if (response.data.data) {
          setPosts(response.data.data);
        } else {
          console.error("No data found in API response.");
        }

        setPageCount(Math.ceil(response.data.total / postsPerPage));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [currentPage, sortOption, filterOption]);

  const getCategoryByFilterOption = (
    filterOption: FilterOption
  ): number | undefined => {
    switch (filterOption) {
      case "category1":
        return 1;
      case "category2":
        return 2;
      case "category3":
        return 3;
      case "category4":
        return 4;
      default:
        return undefined;
    }
  };

  return (
    <div className="w-[1116px] h-[507px] mx-auto">
      <div>
        {/* Dropdown for Sort Option */}
        <label htmlFor="sortOption">Sorteren:</label>
        <select id="sortOption" value={sortOption} onChange={handleSortChange}>
          <option value="recent">Most Recent</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div>
        {/* Dropdown for Filter Option */}
        <label htmlFor="filterOption">Filteren: </label>
        <select
          id="filterOption"
          value={filterOption}
          onChange={handleFilterChange}
        >
          <option value="all">Alle categorieën</option>
          <option value="category1">Tech</option>
          <option value="category2">Nieuws</option>
          <option value="category3">Sports</option>
          <option value="category4">Lokaal</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} variant="small" />
        ))}
      </div>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center mt-8"}
        pageClassName={"mx-1"}
        pageLinkClassName={
          "block px-3 py-2 border rounded-md hover:border-gray-500"
        }
        previousClassName={"mx-1"}
        previousLinkClassName={
          "block px-3 py-2 border rounded-md hover:border-gray-500"
        }
        nextClassName={"mx-1"}
        nextLinkClassName={
          "block px-3 py-2 border rounded-md hover:border-gray-500"
        }
        breakClassName={"mx-1"}
        breakLinkClassName={"block px-3 py-2 border rounded-md"}
        activeClassName={"bg-blue-500 border-blue-500 text-white"}
        forcePage={currentPage}
      />
    </div>
  );
};

export default BlogArchive;
