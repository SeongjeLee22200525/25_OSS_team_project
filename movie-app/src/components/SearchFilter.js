import * as React from "react";
import { Stack, TextField, MenuItem, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select } from "@mui/material";
import { useMovieStore } from "../store";

const YEARS = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 1980 + i).reverse();
const GENRES = ["Action","Drama","Comedy","Thriller","Romance","Animation","SF","Documentary"];
const COUNTRIES = ["Korea","USA","Japan","France","UK","Etc"];

export default function SearchFilter() {
  const { q, setQ, country, setCountry, genre, setGenre, year, setYear, view, setView, sortBy, setSortBy } = useMovieStore();

  return (
    <Stack direction="row" spacing={2} alignItems="center" useFlexGap flexWrap="wrap">
      <TextField label="검색(제목/감독/국가/장르/연도)" value={q} onChange={e=>setQ(e.target.value)} size="small" sx={{ minWidth: 280 }} />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="country">국가</InputLabel>
        <Select labelId="country" label="국가" value={country} onChange={e=>setCountry(e.target.value)}>
          <MenuItem value=""><em>전체</em></MenuItem>
          {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="genre">장르</InputLabel>
        <Select labelId="genre" label="장르" value={genre} onChange={e=>setGenre(e.target.value)}>
          <MenuItem value=""><em>전체</em></MenuItem>
          {GENRES.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="year">연도</InputLabel>
        <Select labelId="year" label="연도" value={year} onChange={e=>setYear(e.target.value)}>
          <MenuItem value=""><em>전체</em></MenuItem>
          {YEARS.map(y => <MenuItem key={y} value={String(y)}>{y}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="sort">정렬</InputLabel>
        <Select labelId="sort" label="정렬" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <MenuItem value="titleKo-asc">제목 ↑</MenuItem>
          <MenuItem value="titleKo-desc">제목 ↓</MenuItem>
          <MenuItem value="rating-desc">평점 ↓</MenuItem>
          <MenuItem value="releaseDate-desc">개봉일 ↓</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup value={view} exclusive onChange={(_, v)=>v && setView(v)} size="small">
        <ToggleButton value="card">카드</ToggleButton>
        <ToggleButton value="table">테이블</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
