/* eslint-disable max-lines-per-function */
/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import * as API from "../api/contentApi";

const contentSlice = createSlice({
  name: "contents",
  initialState: {
    loading: false,
    contents: [],
    content: {
      id: "",
      user: undefined,
      artist_name: "",
      instagram_handle: "",
      facebook_name: "",
      percentage_off: "",
      sponsor: "",
      promoter: "",
      rave_mob: "",
      active: "",
      style: "",
      inspiration: "",
      bio: "",
      link: "",
      picture: "",
      location: "",
      years: "",
      team: "",
      video: "",
      venmo: "",
      products: [],
      chips: [],
      pathname: "",
      public_code: undefined,
      private_code: undefined
    },
    message: "",
    error: {},
    search: "",
    sort: "",
    page: 1,
    limit: 10,
    sort_options: ["Newest", "Artist Name", "Facebook Name", "Instagram Handle", "Sponsor", "Promoter"],
    colors: [
      { name: "Sponsor", color: "#3e4c6d" },
      { name: "Promoter", color: "#7d5555" },
      { name: "Team", color: "#557d6c" },
      { name: "Not Active", color: "#757575" },
      { name: "Rave Mob", color: "#55797d" }
    ]
  },
  reducers: {
    set_content: (state, { payload }) => {
      const updated_content = payload;
      return {
        ...state,
        content: { ...state.content, ...updated_content }
      };
    },
    set_loading: (state, { payload }) => {
      state.loading = payload;
    },
    set_search: (state, { payload }) => {
      state.search = payload;
    },
    set_sort: (state, { payload }) => {
      state.sort = payload;
    },
    set_page: (state, { payload }) => {
      state.page = payload;
    },
    set_limit: (state, { payload }) => {
      state.limit = payload;
    }
  },
  extraReducers: {
    [API.listContents.pending]: (state: any, { payload }: any) => {
      state.loading = true;
      state.contents = [];
    },
    [API.listContents.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.contents = payload.contents;
      state.totalPages = payload.totalPages;
      state.page = payload.currentPage;
      state.message = "Contents Found";
    },
    [API.listContents.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    },
    [API.createContent.pending]: (state: any, { payload }: any) => {
      state.loading = true;
    },
    [API.createContent.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.content = payload.content;
      state.message = "Content Saved";
    },
    [API.createContent.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    },
    [API.updateContent.pending]: (state: any, { payload }: any) => {
      state.loading = true;
    },
    [API.updateContent.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.content = payload.content;
      state.message = "Content Saved";
    },
    [API.updateContent.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    },
    [API.detailsContent.pending]: (state: any, { payload }: any) => {
      state.loading = true;
    },
    [API.detailsContent.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.content = payload;
      state.message = "Content Found";
    },
    [API.detailsContent.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    },
    [API.deleteContent.pending]: (state: any, { payload }: any) => {
      state.loading = true;
    },
    [API.deleteContent.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.content = payload.content;
      state.message = "Content Deleted";
    },
    [API.deleteContent.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    }
  }
});

export const { set_search, set_sort, set_page, set_limit, set_loading, set_content } = contentSlice.actions;
export default contentSlice.reducer;
