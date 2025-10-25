import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, TextField, Checkbox, FormControlLabel } from "@mui/material";

export default function EditPage({ apiBase, onSaveSuccess }) {
  const { id } = useParams(); // mockapi row id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      movieId: "",
      title: "",
      director: "",
      year: "",
      genre: "",
      comment: "",
      rating: 0,
      favorite: false,
    },
  });

  // 해당 항목 불러오기
  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/${id}`);
        if (!res.ok) throw new Error("불러오기 실패: " + res.status);
        const item = await res.json();

        reset({
          movieId: item.movieId || "",
          title: item.title || "",
          director: item.director || "",
          year: item.year || "",
          genre: item.genre || "",
          comment: item.comment || "",
          rating: item.rating ?? 0,
          favorite: !!item.favorite,
        });
      } catch (e) {
        console.error(e);
        alert("데이터를 불러올 수 없습니다.");
        navigate("/mypage");
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [apiBase, id, navigate, reset]);

  async function onSubmit(formData) {
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
        }),
      });

      if (!res.ok) {
        throw new Error("수정 실패: " + res.status);
      }

      const updated = await res.json();

      onSaveSuccess(updated);
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  }

  if (loading) {
    return (
      <div className="card notice center">불러오는 중...</div>
    );
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
              수정 저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
