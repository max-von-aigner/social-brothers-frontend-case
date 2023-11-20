import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import axios from "axios";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shadcn/ui/select";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import CameraIcon from "@/components/CameraIconSvg";

const BlogPostForm: React.FC = () => {
  // State hooks for form data
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State hook for category data
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
      }
    }

    fetchCategories();
  }, []);

  // Handle image selection and preview
  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Read the selected file as a data URL to create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setSelectedImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);

      setImage(selectedFile);
    }
  };

  // Handle form reset
  const handleClear = () => {
    setTitle("");
    setCategoryId("");
    setContent("");
    setImage(null);
    setSelectedImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !categoryId || !image || !content) {
      alert("Please fill in all the fields.");
      return;
    }

    // Create FormData object for API submission
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category_id", categoryId);
    if (image instanceof File) {
      formData.append("image", image);
    }

    try {
      // Send form data to createPost API route
      const response = await axios.post("/api/createPost", formData);
      console.log(response.data);

      // Show success toast
      setShowToast(true);

      // Reset form
      handleClear();

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      // Remove image thumbnail
      setSelectedImagePreview(null);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="flex flex-col w-[451px] p-[24px] min-h-[659px] my-[64px] bg-white relative"
    >
      {/* Form Title */}
      <span className="font-sans font-semibold text-[24px]">
        Plaats een blog bericht
      </span>

      {/* Title Input */}
      <div className="h-[62px] w-[403px] mt-[24px] flex flex-col">
        <Label className="text[12px] h-[15px] w-[403px] font-normal text-neutral-700">
          Berichtnaam
        </Label>
        <Input
          type="text"
          placeholder="Geen titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-none bg-neutral-50 border-transparent mt-[8px]"
        />
      </div>

      {/* Image Upload Section */}
      <div className="h-[62px] w-[403px] mt-[24px] flex flex-col">
        <Label className="text[12px] h-[15px] w-[403px] font-normal text-neutral-700">
          Header afbeelding
        </Label>
        <div className="flex">
          <div className="flex items-center bg-neutral-50 w-[146px] h-[39px] px-[16px] justify-between">
            <CameraIcon className="w-[17px] font-semibold text-gray-500" />
            <Label
              htmlFor="image"
              tabIndex={0}
              className="flex items-center justify-center text[12px] h-[20px] w-[86px] bg-custom-button-gray hover:bg-primary/90 font-normal text-white text-[10px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              id="file-upload-button"
              onKeyDown={(e) => {
                if (e.key === "Enter" && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              Kies bestand
            </Label>
            <input
              id="image"
              type="file"
              accept=".jpg, .png, .jpeg"
              ref={fileInputRef}
              onChange={handlePictureChange}
              className="rounded-none bg-neutral-50 border-transparent mt-[8px] hidden"
              style={{ display: "none" }}
            />
          </div>
          {selectedImagePreview && (
            <div className="flex items-center">
              <img
                src={selectedImagePreview}
                alt="Selected Preview"
                className="rounded object-cover h-[39px] w-[39px]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Category Select */}
      <div className="h-[62px] w-[403px] mt-[24px] flex flex-col">
        <Label className="text[12px] h-[15px] w-[403px] font-normal text-neutral-700">
          Categorie
        </Label>
        <Select
          value={categoryId}
          onValueChange={(value) => setCategoryId(value)}
        >
          <SelectTrigger className="rounded-none bg-neutral-50 border-transparent mt-[8px]">
            <SelectValue placeholder="Geen categorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Textarea */}
      <div className="h-[237px] w-[403px] mt-[24px] flex flex-col">
        <Label
          htmlFor="blogText"
          className="text[12px] h-[15px] w-[403px] font-normal text-neutral-700"
        >
          Bericht
        </Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id="blogText"
          className="rounded-none bg-neutral-50 border-transparent w-[403px] h-[214px] mt-[8px]"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-[24px]">
        <Button
          type="submit"
          className="rounded-full bg-custom-orange w-[202px] h-[39px] text-[12px]"
        >
          Bericht aanmaken
        </Button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute h-20 p-4 font-sans text-center text-black border-gray-600 bottom-24 w-52 toast bg-green-500/50 rounded-2xl">
          Bericht aangemaakt! ✨
        </div>
      )}
    </form>
  );
};

export default BlogPostForm;
