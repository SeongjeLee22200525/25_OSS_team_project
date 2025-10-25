import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, TextField, Checkbox, FormControlLabel } from "@mui/material";

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

  // 혹시라도 쿼리 스트링이 바뀌면 반영
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
            <div className="add-title">{watch("title")}</div>
            <div className="add-sub">
              {watch("director") || "-"} / {watch("year") || "-"} / {watch("genre") || "-"}
            </div>
          </div>

          <Button variant="outlined" onClick={() => navigate(-1)}>
            취소
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="add-form">
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

          <div className="add-actions">
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
