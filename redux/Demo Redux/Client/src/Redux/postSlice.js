import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchPosts = createAsyncThunk("posts/fetchposts", async () => {
  const { data } = await axios(URL);
  return data;
});

export const createPosts = createAsyncThunk("posts/createposts", async () => {
  const { data } = await axios.post(URL);
  return data;
});

const postSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        (state.loading = false), (state.items = action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      });
  },
});

export default postSlice.reducer;
