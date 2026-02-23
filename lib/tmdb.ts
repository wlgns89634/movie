import axios from "axios";

const tmdb = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default tmdb;
