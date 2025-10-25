import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const GENRE_OPTIONS = [
  "",
  "드라마",
  "액션",
  "코미디",
  "스릴러",
  "로맨스",
  "범죄",
  "가족",
  "애니메이션",
  "SF",
  "판타지",
  "다큐멘터리",
];

export default function AddPage({ apiBase, onSaveSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 기본 영화 정보 받아오기 (?movieId=...&title=... 등)
  const params = new URLSearchParams(location.search);
  const movieId = params.get("movieId") || "";
  const title = params.get("title") || "";
  const director = params.get("director") || "";
  const year = params.get("year") || "";
  const genre = params.get("genre") || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      movieId: movieId,
      title: title,
      director: director,
      year: year,
      genre: genre,
      comment: "",
      rating: 0,
      favorite: false,
    },
  });

  // 쿼리스트링이 바뀌면 폼에도 반영
  useEffect(() => {
    setValue("movieId", movieId);
    setValue("title", title);
    setValue("director", director);
    setValue("year", year);
    setValue("genre", genre);
  }, [movieId, title, director, year, genre, setValue]);

  async function onSubmit(formData) {
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
        }),
      });

      if (!res.ok) {
        throw new Error("저장 실패: " + res.status);
      }

      const created = await res.json();
      onSaveSuccess(created);

      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="add-wrapper">
      <div className="add-card">
        <div className="add-header">
          <div>
            <div className="add-title">{watch("title") || "새 영화 추가"}</div>
            <div className="add-sub">
              {watch("director") || "-"} / {watch("year") || "-"} / {watch("genre") || "-"}
            </div>
          </div>

          <Button variant="outlined" onClick={() => navigate(-1)}>
            취소
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="add-form">
          {/* 영화 기본 정보 입력 섹션 */}
          <div className="form-group-vert">
            <label className="form-label-strong">영화명</label>
            <TextField
              size="small"
              placeholder="영화 제목"
              {...register("title")}
            />
          </div>

          <div className="form-group-vert">
            <label className="form-label-strong">감독</label>
            <TextField
              size="small"
              placeholder="감독 이름"
              {...register("director")}
            />
          </div>

          <div className="form-group-vert">
            <label className="form-label-strong">연도</label>
            <TextField
              size="small"
              type="number"
              placeholder="예: 2024"
              inputProps={{ min: 1800, max: 2100 }}
              {...register("year")}
            />
          </div>

          <div className="form-group-vert">
            <label className="form-label-strong">장르</label>
            <FormControl size="small">
              <InputLabel id="genre-label">장르</InputLabel>
              <Select
                labelId="genre-label"
                label="장르"
                value={watch("genre")}
                onChange={(e) => setValue("genre", e.target.value)}
                style={{ minWidth: 140 }}
              >
                {GENRE_OPTIONS.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g === "" ? "(선택 없음)" : g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* 부가 정보 섹션 */}
          <div className="form-group-vert">
            <label className="form-label-strong">한줄평</label>
            <TextField
              size="small"
              placeholder="한줄평"
              {...register("comment")}
            />
          </div>

          <div className="form-group-vert">
            <label className="form-label-strong">평점 (0~5)</label>
            <TextField
              size="small"
              type="number"
              inputProps={{ min: 0, max: 5 }}
              {...register("rating")}
            />
          </div>

          <div className="form-group-vert">
            <label className="form-label-strong">즐겨찾기</label>
            <FormControlLabel
              control={
                <Checkbox
                  {...register("favorite")}
                  defaultChecked={false}
                />
              }
              label={watch("favorite") ? "★ 즐겨찾기 추가" : "☆ 즐겨찾기 안 함"}
            />
          </div>

          {/* 숨겨진 movieId (필요하면 유지) */}
          <input type="hidden" {...register("movieId")} />

          <div className="add-actions">
            <Button variant="contained" color="primary" type="submit">
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
