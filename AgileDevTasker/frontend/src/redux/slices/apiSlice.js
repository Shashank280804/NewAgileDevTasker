import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "https://agiledevtasker-backend.onrender.com";

const baseQuery = fetchBaseQuery({ baseUrl: API_URI });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
