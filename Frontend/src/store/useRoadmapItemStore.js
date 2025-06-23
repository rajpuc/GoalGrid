import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useLoadingStore from "./useLoadingStore";
import toast from "react-hot-toast";
import useAuthenticationStore from "./useAuthenticationStore";

const useRoadmapItemStore = create((set, get) => {
  const { setLoading } = useLoadingStore.getState();

  return {
    roadmapItems: [],
    hasMore: true,
    item: null,
    total: 0,
    comments: [],
    statuses: [],
    categories: [],

    data: {
      limit: 14,
      status: "",
      category: "",
      sortBy: "",
      search: "",
    },
    page: 1,
    updatePage: (value) => set({ page: value }),
    incrementPage: () => set((state) => ({ page: state.page + 1 })),

    updateData: (key, value) =>
      set((state) => ({
        data: {
          ...state.data,
          [key]: value,
        },
      })),

    clearData: () =>
      set(() => ({
        data: {
          limit: 14,
          status: "",
          category: "",
          sortBy: "",
          search: "",
        },
      })),

    fetchUniqueFilters: async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/unique-filters`);

        if (response.data.status === "success") {
          set({
            statuses: response.data.data.statuses,
            categories: response.data.data.categories,
          });
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to fetch filter items."
        );
      } finally {
        setLoading(false);
      }
    },

    fetchFilteredRoadmapItems: async (data = {}, page) => {
      const { limit, status, category, sortBy, search } = data;

      try {
        // Build query string dynamically
        const queryParams = new URLSearchParams();

        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (status) queryParams.append("status", status);
        if (category) queryParams.append("category", category);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (search) queryParams.append("search", search);

        const queryString = queryParams.toString();
        const response = await axiosInstance.get(
          `/filter-items${queryString ? `?${queryString}` : ""}`
        );

        if (response.data.status === "success") {
          const newItems = response.data.data;
          const existingItems = get().roadmapItems;

          const mergedItems = [...existingItems, ...newItems];

          // Remove duplicates based on _id
          const uniqueItems = Array.from(
            new Map(mergedItems.map((item) => [item._id, item])).values()
          );

          set({
            roadmapItems: uniqueItems,
            hasMore: response.data.hasMore,
            total: response.data.total,
          });
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to fetch roadmap items."
        );
      }
    },

    resetRoadmapItems: () => {
      set({ roadmapItems: [], hasMore: true });
    },

    toggleUpvote: async (itemId) => {
      const { roadmapItems } = get();
      const userId = useAuthenticationStore.getState().loggedInUser._id;

      const originalItems = [...roadmapItems];

      const updatedItems = roadmapItems.map((item) => {
        if (item._id === itemId) {
          const alreadyUpvoted = item.upvotes.includes(userId);
          const newUpvotes = alreadyUpvoted
            ? item.upvotes.filter((id) => id !== userId)
            : [...item.upvotes, userId];
          return { ...item, upvotes: newUpvotes };
        }
        return item;
      });

      set({ roadmapItems: updatedItems });

      try {
        await axiosInstance.post(`/upvote/${itemId}`);
      } catch (error) {
        // rollback on failure
        set({ roadmapItems: originalItems });
        toast.error("Failed to update upvote. Please try again.");
      }
    },

    fetchItemDetails: async (id) => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/roadmap-item/${id}`);
        set({
          item: data.data.roadmapItem,
          comments: data.data.comments,
        });
      } catch (err) {
        toast.error("Failed to load item details");
      } finally {
        setLoading(false);
      }
    },

    addComment: async (data) => {
      try {
        setLoading(true);
        const { roadmapItemId } = data;
        const response = await axiosInstance.post(`/comment`, data);
        if (response.data.status === "success") {
          await get().fetchItemDetails(roadmapItemId);
          get().resetRoadmapItems();
          get().clearData();
          get().updatePage(1);
          await get().fetchFilteredRoadmapItems();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add comment");
      } finally {
        setLoading(false);
      }
    },

    updateComment: async (data) => {
      try {
        setLoading(true);
        const { commentId, content, roadmapItemId } = data;
        const response = await axiosInstance.post(
          `/edit-comment/${commentId}`,
          { content }
        );
        if (response.data.status === "success") {
          await get().fetchItemDetails(roadmapItemId);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update comment"
        );
      } finally {
        setLoading(false);
      }
    },

    deleteComment: async (data) => {
      try {
        setLoading(true);
        const { commentId, roadmapItemId } = data;
        const response = await axiosInstance.post(
          `/remove-comment/${commentId}`
        );
        if (response.data.status === "success") {
          await get().fetchItemDetails(roadmapItemId);
          get().resetRoadmapItems();
          get().clearData();
          get().updatePage(1);
          await get().fetchFilteredRoadmapItems();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to delete comment"
        );
      } finally {
        setLoading(false);
      }
    },
  };
});

export default useRoadmapItemStore;
