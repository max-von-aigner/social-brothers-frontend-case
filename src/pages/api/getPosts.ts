import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Destructure query parameters for pagination and filtering
  const {
    page = "1",
    perPage = "4",
    sortBy = "title",
    sortDirection = "asc",
    searchPhrase,
    categoryId,
  } = req.query;

  try {
    const response = await axios.get(
      "https://frontend-case-api.sbdev.nl/api/posts",
      {
        params: {
          page,
          perPage,
          sortBy,
          sortDirection,
          searchPhrase,
          categoryId,
        },
        headers: {
          token: process.env.API_TOKEN,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    res
      .status(error.response?.status || 500)
      .json({ message: "Error fetching posts" });
  }
}
