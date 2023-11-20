import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
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
import CameraIcon from "./CameraIconSvg";

const BlogPostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Gets categories from getCategories API route
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !categoryId || !image || !content) {
      alert("Please fill in all the fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category_id", categoryId);
    if (image instanceof File) {
      formData.append("image", image);
    }

    console.log("API POST Payload: ", [...formData]);

    try {
      // Send the form data to createPost API route
      const response = await axios.post("/api/createPost", formData);
      console.log(response.data);
      // Handle the response, e.g., show success message, clear form, etc.
      setShowToast(true);

      // Clear the form
      setTitle("");
      setCategoryId("");
      setImage(null);
      setContent("");

      // Timer for success toast
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error - handle based on response status
        console.error("Axios error:", error);
        if (error.response?.status === 500) {
          console.error("Internal Server Error:", error.response.data);
          // Handle specific 500 error, if needed
        } else {
          console.error("Other Axios Error:", error.response);
          // Handle other errors, if needed
        }
      } else {
        // Non-Axios error - handle other errors
        console.error("Unexpected error:", error);
      }
    }
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      setSelectedFileName(selectedFile.name); // Set the selected file name

      // Read the selected file as a data URL to create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setSelectedImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileLabelClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
    }
  };

  const handleFileLabelKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter") {
      handleFileLabelClick();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data" // This is important for file uploads
      className="flex flex-col w-[451px] p-[24px] min-h-[659px] my-[64px] bg-white"
    >
      <span className=" font-sans font-semibold text-[24px] ">
        Plaats een blog bericht
      </span>
      <div className=" h-[62px] w-[403px] mt-[24px]">
        <Label className=" text[12px] h-[15px] w-[403px] font-normal text-neutral-700">
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

      <div className=" h-[62px] w-[403px] mt-[24px]">
        <Label className=" text[12px] h-[15px] w-[403px] font-normal text-neutral-700">
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

      <div className=" h-[62px] w-[403px] mt-[24px] flex flex-col">
        <Label className=" text[12px] h-[15px] w-[403px] font-normal text-neutral-700">
          Header afbeelding
        </Label>
        <div className="flex">
          <div className=" flex items-center bg-neutral-50 w-[146px] h-[39px] px-[16px] justify-between">
            <CameraIcon className="w-[17px] font-semibold text-gray-500" />
            <Label
              htmlFor="image"
              onClick={handleFileLabelClick}
              onKeyDown={handleFileLabelKeyDown}
              tabIndex={0}
              className="flex items-center justify-center text[12px] h-[20px] w-[86px] bg-custom-button-gray hover:bg-primary/90 font-normal text-white text-[10px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
              id="file-upload-button"
            >
              Kies bestand
            </Label>
            <Input
              id="image"
              type="file"
              accept=".jpg, .png, .jpeg"
              onChange={handleFileInputChange}
              ref={fileInputRef}
              className="rounded-none bg-neutral-50 border-transparent mt-[8px]"
              style={{ display: "none" }}
            />
          </div>
          {selectedImagePreview && (
            <img
              src={selectedImagePreview}
              alt="Selected Preview"
              className="rounded object-cover h-[39px] w-[39px]"
            />
          )}
        </div>
      </div>

      <div className=" h-[237px] w-[403px] mt-[24px]">
        <Label
          htmlFor="blogText"
          className=" text[12px] h-[15px] w-[403px] font-normal text-neutral-700"
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
      <div className="flex justify-center mt-[24px]">
        <Button
          type="submit"
          className="rounded-full bg-custom-orange w-[202px] h-[39px] text-[12px]"
        >
          Bericht aanmaken
        </Button>
      </div>
      {showToast && (
        <div className="text-white bg-green-500 border-gray-600 toast">
          Bericht aangemaakt! ✨
        </div>
      )}
    </form>
  );
};

export default BlogPostForm;
