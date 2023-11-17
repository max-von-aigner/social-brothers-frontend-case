import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import multer from "multer";
import { CustomNextApiRequest } from "../../../types/next";

const upload = multer({ dest: "uploads/" });

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Handle file upload using multer middleware
      upload.single("image")(req as any, res as any, async (err: any) => {
        if (err) {
          // Handle multer errors
          console.error("Multer error:", err);
          return res
            .status(500)
            .json({ message: "Error handling file upload." });
        }

        try {
          // If there are no multer errors, proceed with forwarding the request
          const { data } = await axios.post(
            "https://frontend-case-api.sbdev.nl/api/posts",
            {
              ...req.body,
              // Update the 'image' field with the correct relative path
              image: `/storage${req.file?.path}`, // Assuming 'path' contains the relative file path
            },
            {
              headers: {
                token: process.env.API_TOKEN,
                // Include any other necessary headers
              },
            }
          );

          res.status(200).json(data);
        } catch (error: any) {
          // Handle errors from the external API
          console.error("External API error:", error);
          res.status(error.response?.status || 500).json({
            message:
              error.response?.data || "An error occurred during the request.",
          });
        }
      });
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  } else {
    // Handle invalid HTTP method
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
