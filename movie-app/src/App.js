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
