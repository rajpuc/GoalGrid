import { create } from "zustand";

const useLoadingStore = create((set,get)=>({
    isLoading:false,
    setLoading:(loading)=> set({isLoading:loading})
}));

export default useLoadingStore;