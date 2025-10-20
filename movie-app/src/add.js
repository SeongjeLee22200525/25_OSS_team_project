import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Stack, Paper, Typography, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { Movies } from "./services/api";
import { useNavigate } from "react-router-dom";

const GENRES = ["Action","Drama","Comedy","Thriller","Romance","Animation","SF","Documentary"];
const COUNTRIES = ["Korea","USA","Japan","France","UK","Etc"];

export default function Add() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      titleKo: "", releaseDate: "", country: "", genre: [], director: "",
      posterUrl: "", rating: 0, likes: 0, favorite: false, memo: ""
    }
  });
  const nav = useNavigate();

  const onSubmit = async (v) => {
    // React Hook Form의 배열/숫자/불린 포함 → MockAPI에 저장
    await Movies.create(v);
    alert("등록 완료");
    nav("/");
  };

  return (
    <Paper sx={{ p:3, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>영화 추가</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller name="titleKo" control={control} rules={{ required: true }}
            render={({ field }) => <TextField {...field} label="제목(한글)" required />} />
          <Controller name="director" control={control}
            render={({ field }) => <TextField {...field} label="감독" />} />
          <Controller name="country" control={control}
            render={({ field }) => (
              <TextField {...field} label="국가" select>
                {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            )} />
          <Controller name="genre" control={control}
            render={({ field }) => (
              <TextField {...field} label="장르(쉼표구분 또는 다중선택)" placeholder="예: Drama,Romance"
                onChange={(e)=>field.onChange(e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
            )} />
          <Controller name="releaseDate" control={control}
            render={({ field }) => <TextField {...field} type="date" label="개봉일" InputLabelProps={{ shrink: true }} />} />
          <Controller name="posterUrl" control={control}
            render={({ field }) => <TextField {...field} label="포스터 이미지 URL" />} />
          <Controller name="rating" control={control}
            render={({ field }) => <TextField {...field} type="number" label="평점(0~10)" inputProps={{ step: 0.5, min:0, max:10 }} />} />
          <Controller name="favorite" control={control}
            render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="즐겨찾기" />} />
          <Controller name="memo" control={control}
            render={({ field }) => <TextField {...field} label="메모" multiline rows={3} />} />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button type="button" onClick={()=>reset()} variant="outlined">초기화</Button>
            <Button type="submit" variant="contained">등록</Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
