// src/store.js
import { create } from "zustand";

export const useMovieStore = create((set) => ({
  q: "",
  country: "",
  genre: "",
  year: "",
  sortBy: "titleKo-asc",
  view: "card",
  setQ: (q) => set({ q }),
  setCountry: (country) => set({ country }),
  setGenre: (genre) => set({ genre }),
  setYear: (year) => set({ year }),
  setSortBy: (sortBy) => set({ sortBy }),
  setView: (view) => set({ view }),
}));
