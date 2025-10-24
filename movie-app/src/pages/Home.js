import * as React from "react";
import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MovieCard from "../components/MovieCard";
import SearchFilter from "../components/SearchFilter";
import { Movies } from "../services/api";
import { useMovieStore } from "../store";
import { Link } from "react-router-dom";

export default function Home() {
  const { q, country, genre, year, sortBy, view } = useMovieStore();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    try {
      // MockAPI에서 전체 조회 후(간단히) 클라이언트 필터링
      const data = await Movies.list();
      let list = data;

      // 간단 검색
      const norm = (s) => String(s ?? "").toLowerCase();
      if (q) {
        list = list.filter(m =>
          norm(m.titleKo).includes(norm(q)) ||
          norm(m.director).includes(norm(q)) ||
          norm(m.country).includes(norm(q)) ||
          norm(Array.isArray(m.genre)? m.genre.join(",") : m.genre).includes(norm(q)) ||
          norm(m.releaseDate).includes(norm(q))
        );
      }
      if (country) list = list.filter(m => String(m.country) === country);
      if (genre)   list = list.filter(m => (Array.isArray(m.genre) ? m.genre.includes(genre) : String(m.genre) === genre));
      if (year)    list = list.filter(m => String(m.releaseDate).startsWith(year));

      const [key, dir] = sortBy.split("-");
      list = list.sort((a,b)=>{
        const av = a[key] ?? ""; const bv = b[key] ?? "";
        if (av < bv) return dir === "asc" ? -1 : 1;
        if (av > bv) return dir === "asc" ? 1 : -1;
        return 0;
      });

      setRows(list);
    } finally {
      setLoading(false);
    }
  }, [q, country, genre, year, sortBy]);

  React.useEffect(()=>{ fetchList(); }, [fetchList]);

  const handleLike = async (m) => {
    await Movies.update(m.id, { favorite: !m.favorite, likes: (Number(m.likes)||0) + (m.favorite ? -1 : 1) });
    fetchList();
  };
  const handleRate = async (m, rating) => {
    await Movies.update(m.id, { rating });
    fetchList();
  };
  const handleDelete = async (m) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    await Movies.remove(m.id);
    fetchList();
  };

  return (
    <Stack spacing={2}>
      <SearchFilter />
      {loading && <Typography>불러오는 중…</Typography>}

      {view === "card" ? (
        <Grid container spacing={2}>
          {rows.map(m => (
            <Grid key={m.id} item xs={12} sm={6} md={4} lg={3}>
              <MovieCard
                movie={m}
                onLike={()=>handleLike(m)}
                onRate={(v)=>handleRate(m, v)}
                onDelete={()=>handleDelete(m)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>포스터</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>국가/장르</TableCell>
                <TableCell>개봉일</TableCell>
                <TableCell>평점</TableCell>
                <TableCell>즐겨찾기</TableCell>
                <TableCell>수정/삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(m => (
                <TableRow key={m.id} hover>
                  <TableCell><img src={m.posterUrl || "https://placehold.co/64x90"} alt="" width={48} /></TableCell>
                  <TableCell><Link to={`/edit/${m.id}`}>{m.titleKo}</Link></TableCell>
                  <TableCell>{m.country} / {Array.isArray(m.genre)? m.genre.join(", "): m.genre}</TableCell>
                  <TableCell>{m.releaseDate}</TableCell>
                  <TableCell>{m.rating ?? 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>handleLike(m)} color={m.favorite?"error":"default"} size="small">
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    {m.likes ?? 0}
                  </TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/edit/${m.id}`} size="small">✏️</IconButton>
                    <IconButton onClick={()=>handleDelete(m)} color="error" size="small"><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
}
