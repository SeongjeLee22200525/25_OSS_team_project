<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import MyPage from "./components/MyPage";
import Add from "./components/Add";
import Edit from "./components/Edit";

// 🔗 mockapi base URL
const MYPAGE_API = "https://68fb355a94ec960660251002.mockapi.io/mypage";

// 장르 선택 옵션 (원하는 장르들 자유롭게 편집 가능)
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

/* ===========================
   검색 조건 영역 컴포넌트
   =========================== */
function SearchBar({
  keyword,
  setKeyword,
  director,
  setDirector,
  genre,
  setGenre,
  onSearch,
  onReset,
}) {
  return (
    <div className="search-card">
      {/* 한 줄: 영화명 / 감독명 / 장르 / 버튼들 */}
      <div className="form-grid-top">
        {/* 영화명 */}
        <div className="form-row-inline">
          <label className="form-label">
            <span className="dot">•</span> 영화명
          </label>
          <input
            className="input"
            placeholder="영화명"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* 감독명 */}
        <div className="form-row-inline">
          <label className="form-label">
            <span className="dot">•</span> 감독명
          </label>
          <input
            className="input"
            placeholder="감독명"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
          />
        </div>

        {/* 장르 */}
        <div className="form-row-inline">
          <label className="form-label">
            <span className="dot">•</span> 장르
          </label>
          <select
            className="select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* 조회/초기화 버튼 */}
        <div className="button-group-right">
          <button className="btn-primary" onClick={onSearch}>
            조회
          </button>
          <button className="btn-outline" onClick={onReset}>
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   검색 결과 테이블
   =========================== */
function ResultTable({ rows, onAddClick }) {
  return (
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
          {rows.map((m) => (
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
                <button
                  className="btn-add"
                  onClick={() => onAddClick(m)}
                >
                  추가
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td className="no-result" colSpan={11}>
                결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ===========================
   메인 App 컴포넌트
   =========================== */
export default function App() {
  // 화면 상태: "home" | "mypage" | "add" | "edit"
  const [route, setRoute] = useState("home");

  // 검색 필터 상태
  const [keyword, setKeyword] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("전체"); // 👈 장르 필터 추가

  // 검색 결과 (KOBIS에서 받아온 영화들)
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  // 로딩/에러/페이지
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // string|null
  const [page, setPage] = useState(1);

  // MyPage 목록 (mockapi 데이터)
  const [myList, setMyList] = useState([]);

  // Add 페이지용 선택 영화
  const [draftMovie, setDraftMovie] = useState(null);

  // Edit 페이지용 수정 대상
  const [editTarget, setEditTarget] = useState(null);

  /* ===========================
     마운트 시 MyPage 불러오기
     =========================== */
  useEffect(() => {
    async function loadMyPage() {
      try {
        const res = await fetch(MYPAGE_API);
        const json = await res.json();
        setMyList(json);
      } catch (e) {
        console.error("MyPage 불러오기 실패:", e);
      }
    }
    loadMyPage();
  }, []);

  /* ===========================
     장르 필터링된 결과 rows
     - KOBIS에서 받아온 data 중에서
       genreAlt에 우리가 고른 장르 문자열이 포함되는지로 필터링한 결과라고 보면 됨
     - 지금 data에는 m.genre 가 대표 장르 하나만 들어가 있으니까
       여기서는 간단히 m.genre로 비교한다.
     =========================== */
  const rows = useMemo(() => {
    return data.filter((m) => {
      if (genre === "전체") return true;
      // 장르가 없는 경우는 걸러냄
      if (!m.genre) return false;
      // 대표 장르 문자열이 현재 선택된 장르에 해당하면 통과
      return m.genre.includes(genre);
    });
  }, [data, genre]);

  /* ===========================
     "추가" 버튼 -> Add 화면
     =========================== */
  function handleAddClick(movie) {
    setDraftMovie(movie);
    setRoute("add");
  }

  /* Add 취소 */
  function handleCancelAdd() {
    setDraftMovie(null);
    setRoute("home");
  }

  /* Add 저장 성공 -> myList 추가 후 mypage 이동 */
  function handleAddSaveSuccess(created) {
    setMyList((prev) => [...prev, created]);
    setDraftMovie(null);
    setRoute("mypage");
  }

  /* MyPage 삭제 */
  async function removeFromMyPage(serverId) {
    try {
      await fetch(`${MYPAGE_API}/${serverId}`, {
        method: "DELETE",
      });
      setMyList((prev) => prev.filter((item) => item.id !== serverId));
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  /* MyPage 수정 버튼 -> Edit 화면 */
  function handleEditClick(id) {
    const target = myList.find((item) => item.id === id);
    if (!target) {
      alert("수정할 항목을 찾을 수 없습니다.");
      return;
    }
    setEditTarget(target);
    setRoute("edit");
  }

  /* Edit 취소 */
  function handleCancelEdit() {
    setEditTarget(null);
    setRoute("mypage");
  }

  /* Edit 저장 성공 -> myList 교체 후 mypage 이동 */
  function handleEditSaveSuccess(updated) {
    setMyList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditTarget(null);
    setRoute("mypage");
  }

  /* ===========================
     공공데이터(KOBIS) API 검색
     =========================== */
  async function fetchKobis({ pageParam }) {
    try {
      setLoading(true);
      setError(null);

      const serviceKey = process.env.REACT_APP_KOBIS_KEY;

      const url = new URL(
        "https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json"
      );
      url.searchParams.set("key", serviceKey);

      // 제목 / 감독
      if (keyword) url.searchParams.set("movieNm", keyword);
      if (director) url.searchParams.set("directorNm", director);

      // 페이지네이션
      url.searchParams.set("curPage", String(pageParam));
      url.searchParams.set("itemPerPage", "20");

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("HTTP " + res.status);

      const json = await res.json();

      // API 결과를 우리 포맷으로 변환
      const list = (json.movieListResult?.movieList || []).map((it) => {
        // 감독
        const firstDirector =
          it.directors && it.directors[0] ? it.directors[0].peopleNm : "";

        // 제작사
        let prodCompany = "";
        if (it.companys && it.companys.length > 0) {
          const prod = it.companys.find(
            (c) => c.companyPartNm === "제작사"
          );
          prodCompany = prod ? prod.companyNm : it.companys[0].companyNm;
        }

        return {
          id: it.movieCd, // KOBIS 영화 코드
          title: it.movieNm,
          titleEn: it.movieNmEn,
          year: it.prdtYear,
          country: it.nationAlt ? it.nationAlt.split(",")[0] : "",
          type: it.typeNm || "",
          // 장르는 콤마 있을 수 있는데 우리는 대표 첫 장르만 사용
          genre: it.genreAlt ? it.genreAlt.split(",")[0] : "",
          status: it.prdtStatNm || "",
          director: firstDirector,
          company: prodCompany,
        };
      });

      setData(list);
      setTotal(Number(json.movieListResult?.totCnt || 0));
    } catch (e) {
      setError(e.message || "API 호출 중 오류가 발생했습니다.");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  // 조회 버튼
  function handleSearch() {
    setPage(1);
    fetchKobis({ pageParam: 1 });
  }

  // 초기화 버튼
  function handleReset() {
    setKeyword("");
    setDirector("");
    setGenre("전체");

    setPage(1);
    setData([]);
    setTotal(0);
    setError(null);
  }

  // 페이지 이동
  function goPrevPage() {
    if (page <= 1) return;
    const next = page - 1;
    setPage(next);
    fetchKobis({ pageParam: next });
  }

  function goNextPage() {
    if (page * 20 >= total) return;
    const next = page + 1;
    setPage(next);
    fetchKobis({ pageParam: next });
  }

  /* ===========================
     route별로 어떤 화면을 보여줄지
     =========================== */
  let screen = null;

  if (route === "home") {
    screen = (
      <>
        {/* 검색 조건 */}
        <SearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          director={director}
          setDirector={setDirector}
          genre={genre}
          setGenre={setGenre}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* 상태 */}
        {loading && (
          <div className="card notice center">불러오는 중...</div>
        )}

        {error && (
          <div className="card notice error center">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* 결과 상단 */}
            <div className="result-header">
              <div className="result-count">
                총 {total.toLocaleString()}건
              </div>
              <div>
                <select className="select small">
                  <option>최신업데이트순</option>
                  <option>제작연도순</option>
                  <option>영화명순</option>
                </select>
              </div>
            </div>

            {/* 결과 테이블 */}
            <ResultTable rows={rows} onAddClick={handleAddClick} />

            {/* 페이지네이션 */}
            <div className="pagination-bar">
              <div className="pagination-info">
                총 {total.toLocaleString()}건 / 페이지 {page}
              </div>

              <div className="pagination-buttons">
                <button
                  className="btn-page"
                  disabled={page <= 1}
                  onClick={goPrevPage}
                >
                  이전
                </button>

                <button
                  className="btn-page"
                  disabled={page * 20 >= total}
                  onClick={goNextPage}
                >
                  다음
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  } else if (route === "mypage") {
    screen = (
      <MyPage
        list={myList}
        remove={removeFromMyPage}
        edit={handleEditClick}
        back={() => setRoute("home")}
      />
    );
  } else if (route === "add") {
    if (!draftMovie) {
      screen = (
        <div className="card notice center">
          잘못된 접근입니다.
          <div style={{ marginTop: "12px" }}>
            <button
              className="btn-outline"
              onClick={() => setRoute("home")}
            >
              홈으로
            </button>
          </div>
        </div>
      );
    } else {
      screen = (
        <Add
          movie={draftMovie}
          apiBase={MYPAGE_API}
          onCancel={handleCancelAdd}
          onSaveSuccess={handleAddSaveSuccess}
        />
      );
    }
  } else if (route === "edit") {
    if (!editTarget) {
      screen = (
        <div className="card notice center">
          잘못된 접근입니다.
          <div style={{ marginTop: "12px" }}>
            <button
              className="btn-outline"
              onClick={() => setRoute("mypage")}
            >
              MyPage로
            </button>
          </div>
        </div>
      );
    } else {
      screen = (
        <Edit
          item={editTarget}
          apiBase={MYPAGE_API}
          onCancel={handleCancelEdit}
          onSaveSuccess={handleEditSaveSuccess}
        />
      );
    }
  }

  /* ===========================
     실제 렌더
     =========================== */
  return (
    <div className="page">
      <div className="shell">
        {/* 상단 헤더/탭 */}
        <header className="header">
          <h1 className="title">영화 검색</h1>

          <nav className="tabs">
            <button
              className={"tab-btn " + (route === "home" ? "tab-active" : "")}
              onClick={() => setRoute("home")}
            >
              목록
            </button>

            <button
              className={"tab-btn " + (route === "mypage" ? "tab-active" : "")}
              onClick={() => setRoute("mypage")}
            >
              MyPage ({myList.length})
            </button>
          </nav>
        </header>

        {screen}
      </div>
    </div>
  );
}
=======
import React, { useEffect, useState } from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import MyPageView from "./pages/MyPageView";
import AddPage from "./pages/AddPage";
import EditPage from "./pages/EditPage";

// mockapi base URL
const MYPAGE_API = "https://68fb355a94ec960660251002.mockapi.io/mypage";

export default function App() {
  // MyPage 목록 (mockapi 데이터)
  const [myList, setMyList] = useState([]);

  // 검색 조건 상태 (HomePage에서 쓰임)
  const [keyword, setKeyword] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("전체");

  // 검색 결과 상태
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // string|null

  // 최초 마운트 시 MyPage 데이터 불러오기
  useEffect(() => {
    async function loadMyPage() {
      try {
        const res = await fetch(MYPAGE_API);
        const json = await res.json();
        setMyList(json);
      } catch (e) {
        console.error("MyPage 불러오기 실패:", e);
      }
    }
    loadMyPage();
  }, []);

  // 스마트 수집 fetch (최소 10개 모으는 버전)
  async function fetchKobisSmart() {
    try {
      setLoading(true);
      setError(null);

      const serviceKey = process.env.REACT_APP_KOBIS_KEY;

      const merged = [];
      let curPage = 1;
      let totalCount = 0;
      const MAX_PAGES = 5; // 장르가 빡세면 최대 5페이지까지 긁는다

      while (merged.length < 10 && curPage <= MAX_PAGES) {
        const url = new URL(
          "https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json"
        );

        url.searchParams.set("key", serviceKey);

        if (keyword) url.searchParams.set("movieNm", keyword);
        if (director) url.searchParams.set("directorNm", director);

        url.searchParams.set("curPage", String(curPage));
        url.searchParams.set("itemPerPage", "20");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("HTTP " + res.status);

        const json = await res.json();

        if (!totalCount) {
          totalCount = Number(json.movieListResult?.totCnt || 0);
        }

        const pageList = (json.movieListResult?.movieList || []).map((it) => {
          const firstDirector =
            it.directors && it.directors[0]
              ? it.directors[0].peopleNm
              : "";

          let prodCompany = "";
          if (it.companys && it.companys.length > 0) {
            const prod = it.companys.find(
              (c) => c.companyPartNm === "제작사"
            );
            prodCompany = prod
              ? prod.companyNm
              : it.companys[0].companyNm;
          }

          return {
            id: it.movieCd,
            title: it.movieNm,
            titleEn: it.movieNmEn,
            year: it.prdtYear,
            country: it.nationAlt ? it.nationAlt.split(",")[0] : "",
            type: it.typeNm || "",
            genre: it.genreAlt ? it.genreAlt.split(",")[0] : "",
            status: it.prdtStatNm || "",
            director: firstDirector,
            company: prodCompany,
          };
        });

        // 장르 필터
        const filtered = pageList.filter((m) => {
          if (genre === "전체") return true;
          if (!m.genre) return false;
          return m.genre.includes(genre);
        });

        merged.push(...filtered);

        curPage++;
        if (pageList.length === 0) break;
      }

      setData(merged);
      setTotal(totalCount);
    } catch (e) {
      console.error(e);
      setError(e.message || "API 호출 중 오류가 발생했습니다.");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  // 초기화 버튼에서 쓸 리셋
  function resetSearch() {
    setKeyword("");
    setDirector("");
    setGenre("전체");
    setData([]);
    setTotal(0);
    setError(null);
  }

  // MyPage에서 항목 삭제
  async function removeFromMyPage(serverId) {
    try {
      await fetch(`${MYPAGE_API}/${serverId}`, {
        method: "DELETE",
      });
      setMyList((prev) => prev.filter((item) => item.id !== serverId));
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  // Add에서 저장 성공 시
  function handleAddSaveSuccess(created) {
    setMyList((prev) => [...prev, created]);
  }

  // Edit에서 저장 성공 시
  function handleEditSaveSuccess(updated) {
    setMyList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  }

  return (
    <Router>
      <div className="page">
        <div className="shell">
          {/* 공통 헤더 */}
          <header className="header">
            <h1 className="title">영화 검색</h1>

            <nav className="tabs">
              <Link
                className="tab-btn"
                to="/"
              >
                목록
              </Link>

              <Link
                className="tab-btn"
                to="/mypage"
              >
                MyPage ({myList.length})
              </Link>
            </nav>
          </header>

          {/* 라우트별 화면 */}
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  keyword={keyword}
                  setKeyword={setKeyword}
                  director={director}
                  setDirector={setDirector}
                  genre={genre}
                  setGenre={setGenre}
                  data={data}
                  total={total}
                  loading={loading}
                  error={error}
                  onSearch={fetchKobisSmart}
                  onReset={resetSearch}
                />
              }
            />
            <Route
              path="/mypage"
              element={
                <MyPageView
                  list={myList}
                  remove={removeFromMyPage}
                />
              }
            />
            <Route
              path="/add"
              element={
                <AddPage
                  apiBase={MYPAGE_API}
                  onSaveSuccess={handleAddSaveSuccess}
                />
              }
            />
            <Route
              path="/edit/:id"
              element={
                <EditPage
                  apiBase={MYPAGE_API}
                  onSaveSuccess={handleEditSaveSuccess}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
>>>>>>> lsj
