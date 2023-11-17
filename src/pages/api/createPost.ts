// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";
// import multer from "multer";
// import { CustomNextApiRequest } from "../../../types/next";

// const upload = multer({ dest: "uploads/" });

// export default async function handler(
//   req: CustomNextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     try {
//       // Handle file upload using multer middleware
//       upload.single("image")(req as any, res as any, async (err: any) => {
//         if (err) {
//           // Handle multer errors
//           console.error("Multer error:", err);
//           return res
//             .status(500)
//             .json({ message: "Error handling file upload." });
//         }

//         try {
//           // If there are no multer errors, proceed with forwarding the request
//           const { data } = await axios.post(
//             "https://frontend-case-api.sbdev.nl/api/posts",
//             {
//               ...req.body,
//               // Update the 'image' field with the correct relative path
//               image: `/storage${req.file?.path}`, // Assuming 'path' contains the relative file path
//             },
//             {
//               headers: {
//                 token: process.env.API_TOKEN,
//               },
//             }
//           );

//           res.status(200).json(data);
//         } catch (error: any) {
//           // Handle errors from the external API
//           console.error("External API error:", error);
//           res.status(error.response?.status || 500).json({
//             message:
//               error.response?.data || "An error occurred during the request.",
//           });
//         }
//       });
//     } catch (error) {
//       // Handle unexpected errors
//       console.error("Unexpected error:", error);
//       res.status(500).json({ message: "An unexpected error occurred." });
//     }
//   } else {
//     // Handle invalid HTTP method
//     res.setHeader("Allow", "POST");
//     res.status(405).end("Method Not Allowed");
//   }
// }

// createPosts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import { CustomNextApiRequest } from "../../../types/next";

const upload = multer({ dest: "uploads/" });

export default function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // upload.single('image')(req, res, async (err: Error) => {
    upload.single("image")(req as any, res as any, async (err: any) => {
      if (err) {
        // Handle multer errors
        console.error("Multer error:", err);
        return res.status(500).json({ message: "Error handling file upload." });
      }

      // Check if the file is uploaded successfully
      if (!req.file) {
        return res.status(500).json({ message: "File upload failed." });
      }

      // After multer processing, create a new FormData for axios request
      const formData = new FormData();
      formData.append("title", req.body.title);
      formData.append("content", req.body.content);
      formData.append("category_id", req.body.category_id);

      // Create a read stream for the file and append it to the FormData
      const fileStream = fs.createReadStream(req.file.path);
      formData.append("image", fileStream);

      try {
        // Send the POST request to the remote API
        const response = await axios.post(
          "https://frontend-case-api.sbdev.nl/api/posts",
          formData,
          {
            headers: {
              ...formData.getHeaders(), // Automatically sets the correct Content-Type and boundary
              token: process.env.API_TOKEN, // Include the API token
              // Remove the manual Content-Type header as axios and formData handle it
            },
            maxBodyLength: Infinity, // Necessary for large files
          }
        );

        // Clean up: delete the file after uploading
        fs.unlinkSync(req.file.path);

        // Send back the response from the remote API
        res.status(200).json(response.data);
      } catch (error: any) {
        // If there's an error, delete the uploaded file
        if (req.file) fs.unlinkSync(req.file.path);

        // Handle the error
        console.error("API request error:", error);
        res.status(error.response?.status || 500).json({
          message:
            error.response?.data.message ||
            "An error occurred on the remote API.",
        });
      }
    });
  } else {
    // Handle invalid HTTP method
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
