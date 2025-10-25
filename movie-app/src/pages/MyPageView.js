import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function MyPageView({ list, remove }) {
  const navigate = useNavigate();

  function goEdit(id) {
    navigate(`/edit/${id}`);
  }

  return (
    <div className="mypage-block">
      <div className="mypage-header" style={{display: "flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2 className="mypage-title">My Page</h2>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
        >
          목록으로
        </Button>
      </div>

      <div className="table-wrapper">
        <table className="movie-table">
          <thead>
            <tr>
              <th>영화명</th>
              <th>감독</th>
              <th>연도</th>
              <th>장르</th>
              <th>한줄평</th>
              <th>평점</th>
              <th>즐겨찾기</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td>{m.director || "-"}</td>
                <td>{m.year || "-"}</td>
                <td>{m.genre || "-"}</td>
                <td>{m.comment || "-"}</td>
                <td>{m.rating ?? "-"}</td>
                <td>{m.favorite ? "★" : "☆"}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => goEdit(m.id)}
                    >
                      수정
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => remove(m.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td className="no-result" colSpan={8}>
                  저장된 항목이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:"16px"}}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/add")}
        >
          직접 추가하기
        </Button>
      </div>
    </div>
  );
}
