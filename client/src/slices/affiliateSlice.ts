/* eslint-disable max-lines-per-function */
/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import * as API from "../api/affiliateApi";

const affiliatesSlice = createSlice({
  name: "affiliates",
  initialState: {
    loading: false,
    affiliates: [],
    affiliate: {
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
    success: false,
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
    set_affiliate: (state, { payload }) => {
      const updated_affiliate = payload;
      return {
        ...state,
        affiliate: { ...state.affiliate, ...updated_affiliate }
      };
    },
    set_loading: (state, { payload }) => {
      state.loading = payload;
    },
    set_success: (state, { payload }) => {
      state.success = payload;
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
    [API.listAffiliates.pending]: (state: any, { payload }: any) => {
      state.loading = true;
      state.affiliates = [];
    },
    [API.listAffiliates.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.affiliates = payload.affiliates;
      state.totalPages = payload.totalPages;
      state.page = payload.currentPage;
      state.message = "Affiliates Found";
    },
    [API.listAffiliates.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    },
    [API.createAffiliate.pending]: (state: any, { payload }: any) => {
      state.loading = true;
    },
    [API.createAffiliate.fulfilled]: (state: any, { payload }: any) => {
      const affiliate = {
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
      };
      state.loading = false;
      state.affiliate = affiliate;
      state.message = "Affiliate Saved";
    },
    [API.createAffiliate.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    },
    [API.updateAffiliate.pending]: (state: any, { payload }: any) => {
      state.loading = true;
      state.success = false;
    },
    [API.updateAffiliate.fulfilled]: (state: any, { payload }: any) => {
      const affiliate = {
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
      };
      state.loading = false;
      state.success = true;
      state.affiliate = affiliate;
      state.message = "Affiliate Saved";
    },
    [API.updateAffiliate.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
      state.success = false;
    },
    [API.detailsAffiliate.pending]: (state: any, { payload }: any) => {
      state.loading = true;
    },
    [API.detailsAffiliate.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.affiliate = payload;
      state.message = "Affiliate Found";
    },
    [API.detailsAffiliate.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    },
    [API.deleteAffiliate.pending]: (state: any, { payload }: any) => {
      state.loading = true;
    },
    [API.deleteAffiliate.fulfilled]: (state: any, { payload }: any) => {
      state.loading = false;
      state.affiliate = payload.affiliate;
      state.message = "Affiliate Deleted";
    },
    [API.deleteAffiliate.rejected]: (state: any, { payload }: any) => {
      state.loading = false;
      state.error = payload.error;
      state.message = payload.message;
    }
  }
});

export const { set_search, set_sort, set_page, set_success, set_limit, set_loading, set_affiliate } = affiliatesSlice.actions;
export default affiliatesSlice.reducer;
