import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Stack, Paper, Typography, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { Movies } from "./services/api";

const GENRES = ["Action","Drama","Comedy","Thriller","Romance","Animation","SF","Documentary"];
const COUNTRIES = ["Korea","USA","Japan","France","UK","Etc"];

export default function Edit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { control, handleSubmit, reset } = useForm();

  React.useEffect(()=>{
    (async()=>{
      const m = await Movies.get(id);
      // genre가 문자열이면 배열로 보정
      if (typeof m.genre === "string") m.genre = m.genre.split(",").map(s=>s.trim()).filter(Boolean);
      reset(m);
    })();
  }, [id, reset]);

  const onSubmit = async (v) => {
    await Movies.update(id, v);
    alert("수정 완료");
    nav("/");
  };
  const onDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    await Movies.remove(id);
    alert("삭제 완료");
    nav("/");
  };

  return (
    <Paper sx={{ p:3, maxWidth: 720, mx:"auto" }}>
      <Typography variant="h6" gutterBottom>영화 수정</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller name="titleKo" control={control}
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
              <TextField {...field} label="장르(쉼표구분 또는 다중선택)"
                onChange={(e)=>field.onChange(e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
            )} />
          <Controller name="releaseDate" control={control}
            render={({ field }) => <TextField {...field} type="date" label="개봉일" InputLabelProps={{ shrink: true }} />} />
          <Controller name="posterUrl" control={control}
            render={({ field }) => <TextField {...field} label="포스터 이미지 URL" />} />
          <Controller name="rating" control={control}
            render={({ field }) => <TextField {...field} type="number" label="평점(0~10)" inputProps={{ step:0.5, min:0, max:10 }} />} />
          <Controller name="favorite" control={control}
            render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={!!field.value} />} label="즐겨찾기" />} />
          <Controller name="memo" control={control}
            render={({ field }) => <TextField {...field} label="메모" multiline rows={3} />} />

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button color="error" onClick={onDelete} variant="outlined">삭제</Button>
            <Stack direction="row" spacing={1}>
              <Button type="button" onClick={()=>nav(-1)} variant="outlined">취소</Button>
              <Button type="submit" variant="contained">저장</Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
