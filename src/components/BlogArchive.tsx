import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import BlogPostCard from "./BlogPostCard";
import { BlogPost } from "./BlogPostPreview";
import {
  BlogArchiveSelect,
  BlogArchiveSelectGroup,
  BlogArchiveSelectValue,
  BlogArchiveSelectTrigger,
  BlogArchiveSelectContent,
  BlogArchiveSelectLabel,
  BlogArchiveSelectItem,
  BlogArchiveSelectSeparator,
} from "./BlogArchiveSelect";
import { BlogArchiveLabel } from "./BlogArchiveLabel";

// Define types for sorting and filtering options
type SortOption = "recent" | "title";
type FilterOption =
  | "all"
  | "category1"
  | "category2"
  | "category3"
  | "category4";

const BlogArchive: React.FC = () => {
  // Constants and state hooks for pagination and data
  const postsPerPage: number = 8;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  // Event handler for page change
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  // Event handler for sort option change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  // Event handler for filter option change
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value as FilterOption);
  };

  // Utility function to map filter options to category IDs
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

  // State hook for storing category data
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("/api/getCategories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Handle error - show user feedback, retry logic, etc.
      }
    }

    fetchCategories();
  }, []);

  // Fetch posts based on pagination, sorting, and filtering options
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/getPosts`, {
          params: {
            page: currentPage + 1,
            perPage: postsPerPage,
            sortBy: sortOption === "recent" ? "created_at" : "title",
            sortDirection: "desc",
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

  return (
    <div className="w-[1116px]  mx-auto">
      {/* Sort and Filter Dropdowns */}
      <div className="flex gap-4 mb-4">
        {/* Sort Dropdown */}
        <div className="flex font-sans">
          <BlogArchiveLabel
            htmlFor="sortOption"
            className="flex items-center w-20"
          >
            Sorteren:
          </BlogArchiveLabel>
          <BlogArchiveSelect
            value={sortOption}
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <BlogArchiveSelectTrigger className="rounded-none bg-neutral-50 border-transparent mt-[8px]">
              <BlogArchiveSelectValue placeholder="Geen categorie" />
            </BlogArchiveSelectTrigger>
            <BlogArchiveSelectContent>
              <BlogArchiveSelectItem value="recent">
                Laatste
              </BlogArchiveSelectItem>
              <BlogArchiveSelectItem value="title">Titel</BlogArchiveSelectItem>
            </BlogArchiveSelectContent>
          </BlogArchiveSelect>
        </div>

        {/* Filter Dropdown */}
        <div className="flex">
          <BlogArchiveLabel
            htmlFor="filterOption"
            className="flex items-center w-20"
          >
            Filteren:{" "}
          </BlogArchiveLabel>
          <BlogArchiveSelect
            value={filterOption}
            onValueChange={(value) => setFilterOption(value as FilterOption)}
          >
            <BlogArchiveSelectTrigger className="rounded-none bg-neutral-50 border-transparent mt-[8px]">
              <BlogArchiveSelectValue placeholder="Geen categorie" />
            </BlogArchiveSelectTrigger>
            <BlogArchiveSelectContent>
              <BlogArchiveSelectItem value="all">
                Alle categorieën
              </BlogArchiveSelectItem>
              {categories.map((category) => (
                <BlogArchiveSelectItem
                  key={category.id}
                  value={`category${category.id}`}
                >
                  {category.name}
                </BlogArchiveSelectItem>
              ))}
            </BlogArchiveSelectContent>
          </BlogArchiveSelect>
        </div>
      </div>

      {/* Blog Post Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 min-h-[507px]">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} variant="small" />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <ReactPaginate
          previousLabel={"← Vorige pagina"}
          nextLabel={"Volgende pagina →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={
            "flex flex-grow justify-center mt-8 h-[29px] items-center w-[435px]"
          }
          pageClassName={"mx-1"}
          pageLinkClassName={"block text-[12px] rounded-xl"}
          previousClassName={"mx-1 text-[12px]"}
          previousLinkClassName={
            "block py-2  rounded-md text-custom-orange mr-[24px]"
          }
          nextClassName={"text-[12px] mx-1"}
          nextLinkClassName={"block rounded-md text-custom-orange ml-[24px]"}
          breakClassName={"mx-1"}
          breakLinkClassName={"block rounded-md"}
          activeClassName={
            "flex items-center justify-center bg-pagination-focus-gray rounded-xl w-[34px] h-[25px] text-pagination-text font-bold text-[14px]"
          }
          forcePage={currentPage}
        />
      </div>
    </div>
  );
};

export default BlogArchive;
