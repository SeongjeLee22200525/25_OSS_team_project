import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const GENRE_OPTIONS = [
  "전체",
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

export default function HomePage({
  keyword,
  setKeyword,
  director,
  setDirector,
  genre,
  setGenre,
  data,
  total,
  loading,
  error,
  onSearch,
  onReset,
}) {
  const navigate = useNavigate();

  // 결과 테이블에서 "추가" 눌렀을 때
  // 영화 정보를 Add 페이지로 넘기는 법:
  // - querystring으로 movieId 등 전달
  function goAdd(movie) {
    // 최소한 영화 코드, 제목 정도 전달
    const qs = new URLSearchParams({
      movieId: movie.id,
      title: movie.title ?? "",
      director: movie.director ?? "",
      year: movie.year ?? "",
      genre: movie.genre ?? "",
    }).toString();

    navigate(`/add?${qs}`);
  }

  return (
    <>
      {/* 검색 카드 */}
      <div className="search-card">
        <div className="form-grid-top" style={{ flexWrap: "wrap", rowGap: "12px" }}>
          {/* 영화명 */}
          <div className="form-row-inline">
            <span className="form-label"><span className="dot">•</span> 영화명</span>
            <TextField
              size="small"
              placeholder="영화명"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* 감독명 */}
          <div className="form-row-inline">
            <span className="form-label"><span className="dot">•</span> 감독명</span>
            <TextField
              size="small"
              placeholder="감독명"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
            />
          </div>

          {/* 장르 */}
          <div className="form-row-inline">
            <span className="form-label"><span className="dot">•</span> 장르</span>
            <FormControl size="small">
              <InputLabel id="genre-label">장르</InputLabel>
              <Select
                labelId="genre-label"
                value={genre}
                label="장르"
                onChange={(e) => setGenre(e.target.value)}
                style={{ minWidth: 120 }}
              >
                {GENRE_OPTIONS.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* 버튼 그룹 */}
          <div className="button-group-right" style={{ display: "flex", gap: "8px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onSearch}
            >
              조회
            </Button>
            <Button
              variant="outlined"
              onClick={onReset}
            >
              초기화
            </Button>
          </div>
        </div>
      </div>

      {/* 상태 표시 */}
      {loading && (
        <div className="card notice center">불러오는 중...</div>
      )}
      {error && (
        <div className="card notice error center">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="result-header">
            <div className="result-count">총 {total.toLocaleString()}건</div>
            <div>
              <select className="select small">
                <option>최신업데이트순</option>
                <option>제작연도순</option>
                <option>영화명순</option>
              </select>
            </div>
          </div>

          {/* 결과 테이블 */}
          <div className="table-wrapper">
            <table className="movie-table">
              <thead>
                <tr>
                  <th>영화명</th>
                  <th>영화명(영문)</th>
                  <th>영화코드</th>
                  <th>제작연도</th>
                  <th>제작국가</th>
                  <th>유형</th>
                  <th>장르</th>
                  <th>제작상태</th>
                  <th>감독</th>
                  <th>제작사</th>
                  <th>추가</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr key={m.id}>
                    <td className="link-cell">{m.title || "-"}</td>
                    <td className="link-cell">{m.titleEn || "-"}</td>
                    <td>{m.id || "-"}</td>
                    <td>{m.year || "-"}</td>
                    <td>{m.country || "-"}</td>
                    <td>{m.type || "-"}</td>
                    <td>{m.genre || "-"}</td>
                    <td>{m.status || "-"}</td>
                    <td>{m.director || "-"}</td>
                    <td>{m.company || "-"}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => goAdd(m)}
                      >
                        추가
                      </Button>
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td colSpan={11} className="no-result">
                      결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
