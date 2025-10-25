import React from "react";

export default function MyPage({ list, remove, edit, back }) {
  return (
    <div className="mypage-block">
      <div className="mypage-header">
        <h2 className="mypage-title">My Page</h2>
        <button className="btn-outline" onClick={back}>
          목록으로
        </button>
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
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      className="btn-outline"
                      onClick={() => edit(m.id)}
                    >
                      수정
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => remove(m.id)}
                    >
                      삭제
                    </button>
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
    </div>
  );
}
