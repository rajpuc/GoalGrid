import { create } from "zustand";
import axiosInstance from "../lib/axios";
import useLoadingStore from "./useLoadingStore";
import toast from "react-hot-toast";

const useAuthenticationStore = create((set, get) => {
  const { setLoading } = useLoadingStore.getState();
  return {
    loggedInUser: null,
    checkAuth: async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/check-auth");
        if (response.data.status === "success") {
          set({ loggedInUser: response.data.data });
        }
      } catch (error) {
        set({ loggedInUser: null });
      } finally {
        setLoading(false);
      }
    },
    uploadFile: async (data) => {
      try {
        const response = await axiosInstance.post("/upload-file", {file:data});
        if (response.data.status === "success") {
          return response.data.data;
        }
      } catch (error) {
        return null;
      } 
      
    },
    signIn: async (data) => {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/login", data);
        if (response.data.status === "success") {
          set({ loggedInUser: response.data.data });
          toast.success(response.data.message);
          return true;
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message ||"Login Failed");
      } finally {
        setLoading(false);
      }
      return false;
    },
    signUp:  async (data) => {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/register", data);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          return true;
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || "Registration Failed");
      } finally {
        setLoading(false);
      }
      return false;
    },
    logout: async () => {
      try {
        const response = await axiosInstance.get("/logout");
        if (response.data.status === "success") {
          set({ loggedInUser: null });
          toast.success(response.data.message);
          return true;
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message ||"Something went wrong");
      }
      return false;
    },
  };
});

export default useAuthenticationStore;
