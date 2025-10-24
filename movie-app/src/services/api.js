import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_MOCKAPI_BASE, // ex) https://xxxxx.mockapi.io/api/v1
});

// ------- Movies CRUD (MockAPI) -------
export const Movies = {
  list: (params = {}) => api.get("/movies", { params }).then(r => r.data),
  get: (id) => api.get(`/movies/${id}`).then(r => r.data),
  create: (data) => api.post("/movies", data).then(r => r.data),
  update: (id, data) => api.put(`/movies/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/movies/${id}`).then(r => r.data),
};

// ------- KOBIS Open API (공공데이터) -------
const KOBIS_KEY = process.env.REACT_APP_KOBIS_KEY;

// 간단: 영화명으로 검색
export const searchKobisByTitle = async (query, page = 1) => {
  if (!KOBIS_KEY) return { movieList: [] };
  const url = `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${KOBIS_KEY}&movieNm=${encodeURIComponent(query)}&curPage=${page}`;
  const { data } = await axios.get(url);
  return data.movieListResult || { movieList: [] };
};

export default api;
