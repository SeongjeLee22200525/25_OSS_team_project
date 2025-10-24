import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import MyPage from "./components/MyPage";
import Add from "./components/Add"; // ✅ 새로 만든 추가 폼 컴포넌트 import

// mockapi base URL
const MYPAGE_API = "https://68fb355a94ec960660251002.mockapi.io/mypage";

// 연도 옵션
function buildYearOptions() {
  const current = new Date().getFullYear();
  const min = 1980;
  const arr = [];
  for (let y = current; y >= min; y--) {
    arr.push(String(y));
  }
  return arr;
}
const YEAR_OPTIONS = buildYearOptions();

/* ===========================
   검색 폼 (App 안에 그대로 둠)
   =========================== */
function SearchBar({
  keyword,
  setKeyword,
  director,
  setDirector,
  yearStart,
  setYearStart,
  yearEnd,
  setYearEnd,
  openStart,
  setOpenStart,
  openEnd,
  setOpenEnd,
  onSearch,
  onReset,
}) {
  return (
    <div className="search-card">
      {/* 첫 줄 */}
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

        {/* 조회 / 초기화 */}
        <div className="button-group-right">
          <button className="btn-primary" onClick={onSearch}>
            조회
          </button>
          <button className="btn-outline" onClick={onReset}>
            초기화
          </button>
        </div>
      </div>

      <div className="divider" />

      {/* 둘째 줄 */}
      <div className="form-grid-bottom">
        {/* 제작연도 */}
        <div className="form-row-inline wrap">
          <label className="form-label">
            <span className="dot">•</span> 제작연도
          </label>

          <select
            className="select"
            value={yearStart}
            onChange={(e) => setYearStart(e.target.value)}
          >
            <option value="">--전체--</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <span className="range-tilde">~</span>

          <select
            className="select"
            value={yearEnd}
            onChange={(e) => setYearEnd(e.target.value)}
          >
            <option value="">--전체--</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* 개봉일자 */}
        <div className="form-row-inline wrap">
          <label className="form-label">
            <span className="dot">•</span> 개봉일자
          </label>

          <input
            type="date"
            className="input-date"
            value={openStart}
            onChange={(e) => setOpenStart(e.target.value)}
          />
          <span className="range-tilde">~</span>
          <input
            type="date"
            className="input-date"
            value={openEnd}
            onChange={(e) => setOpenEnd(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ===========================
   검색 결과 테이블 (App 안에 그대로 둠)
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
   메인 App
   =========================== */
export default function App() {
  // route: "home" | "mypage" | "add"
  const [route, setRoute] = useState("home");

  // 폼 입력값 상태
  const [keyword, setKeyword] = useState("");
  const [director, setDirector] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [openStart, setOpenStart] = useState("");
  const [openEnd, setOpenEnd] = useState("");

  // 검색 결과 (KOBIS)
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  // 요청 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 문자열 또는 null
  const [page, setPage] = useState(1);

  // MyPage 목록 (mockapi 데이터)
  const [myList, setMyList] = useState([]);

  // Add 페이지에서 쓸 "지금 추가하려는 영화"
  const [draftMovie, setDraftMovie] = useState(null);

  // 첫 로딩 시 MyPage 불러오기
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

  // 화면에 그릴 검색 결과 rows
  const rows = useMemo(() => data, [data]);

  /* ----------------------------------
     "추가" 버튼 눌렀을 때 → Add 화면으로 이동
     ---------------------------------- */
  function handleAddClick(movie) {
    setDraftMovie(movie);   // Add에서 사용할 영화 정보 저장
    setRoute("add");        // 라우트 전환
  }

  /* ----------------------------------
     Add 화면에서 "취소" 눌렀을 때
     ---------------------------------- */
  function handleCancelAdd() {
    setDraftMovie(null);
    setRoute("home");
  }

  /* ----------------------------------
     Add 화면에서 "저장" 성공했을 때
     created: mockapi에서 새로 만들어준 row
     -> myList에 추가하고 route를 mypage로
     ---------------------------------- */
  function handleSaveSuccess(created) {
    setMyList((prev) => [...prev, created]);
    setDraftMovie(null);
    setRoute("mypage");
  }

  /* ----------------------------------
     MyPage에서 삭제
     ---------------------------------- */
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

  /* ----------------------------------
     KOBIS API 호출
     ---------------------------------- */
  async function fetchKobis({ pageParam }) {
    try {
      setLoading(true);
      setError(null);

      const serviceKey = process.env.REACT_APP_KOBIS_KEY;

      const url = new URL(
        "https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json"
      );

      url.searchParams.set("key", serviceKey);

      if (keyword) url.searchParams.set("movieNm", keyword);
      if (director) url.searchParams.set("directorNm", director);

      if (yearStart) url.searchParams.set("prdtStartYear", yearStart);
      if (yearEnd) url.searchParams.set("prdtEndYear", yearEnd);

      const cleanStart = openStart ? openStart.replaceAll("-", "") : "";
      const cleanEnd = openEnd ? openEnd.replaceAll("-", "") : "";
      if (cleanStart) url.searchParams.set("openStartDt", cleanStart);
      if (cleanEnd) url.searchParams.set("openEndDt", cleanEnd);

      url.searchParams.set("curPage", String(pageParam));
      url.searchParams.set("itemPerPage", "20");

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("HTTP " + res.status);

      const json = await res.json();

      const list = (json.movieListResult?.movieList || []).map((it) => {
        const firstDirector =
          it.directors && it.directors[0] ? it.directors[0].peopleNm : "";

        let prodCompany = "";
        if (it.companys && it.companys.length > 0) {
          const prod = it.companys.find(
            (c) => c.companyPartNm === "제작사"
          );
          prodCompany = prod ? prod.companyNm : it.companys[0].companyNm;
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
    setYearStart("");
    setYearEnd("");
    setOpenStart("");
    setOpenEnd("");
    setPage(1);
    setData([]);
    setTotal(0);
    setError(null);
  }

  // 이전/다음 페이지
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

  /* ----------------------------------
     화면 전환 렌더링
     ---------------------------------- */

  let screen = null;

  if (route === "home") {
    screen = (
      <>
        <SearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          director={director}
          setDirector={setDirector}
          yearStart={yearStart}
          setYearStart={setYearStart}
          yearEnd={yearEnd}
          setYearEnd={setYearEnd}
          openStart={openStart}
          setOpenStart={setOpenStart}
          openEnd={openEnd}
          setOpenEnd={setOpenEnd}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {loading && (
          <div className="card notice center">불러오는 중...</div>
        )}

        {error && (
          <div className="card notice error center">{error}</div>
        )}

        {!loading && !error && (
          <>
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

            <ResultTable rows={rows} onAddClick={handleAddClick} />

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
        back={() => setRoute("home")}
      />
    );
  } else if (route === "add") {
    // draftMovie가 없으면 홈으로 보내기 안전장치
    if (!draftMovie) {
      screen = (
        <div className="card notice center">
          잘못된 접근입니다.
          <div style={{ marginTop: "12px" }}>
            <button className="btn-outline" onClick={() => setRoute("home")}>
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
          onSaveSuccess={handleSaveSuccess}
        />
      );
    }
  }

  return (
    <div className="page">
      <div className="shell">
        {/* 상단 헤더 + 탭 */}
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
