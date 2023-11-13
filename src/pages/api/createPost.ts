// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { data } = await axios.post(
        "https://frontend-case-api.sbdev.nl/api/posts",
        req.body,
        {
          headers: {
            token: process.env.API_TOKEN,
          },
        }
      );

      res.status(200).json(data);
    } catch (error) {
      // check if error is axios error
      if (axios.isAxiosError(error)) {
        // // if it's an axios error we can access the response property
        console.error(error.message);
        res.status(error.response?.status || 500).json({
          message:
            error.response?.data || "An error occurred during the request.",
        });
      } else {
        // if it's a different error than an axios error, we will show "unexpected error" message
        console.error("An unexpected error occurred:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
