import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { data } = await axios.get(
        "https://frontend-case-api.sbdev.nl/api/categories",
        {
          headers: {
            token: process.env.API_TOKEN,
          },
        }
      );
      res.status(200).json(data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      res
        .status(error.response?.status || 500)
        .json({ message: "Error fetching categories" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
