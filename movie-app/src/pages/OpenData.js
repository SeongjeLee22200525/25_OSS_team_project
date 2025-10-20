import * as React from "react";
import { Stack, TextField, Button, Typography, Paper } from "@mui/material";
import { searchKobisByTitle } from "../services/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function OpenData() {
  const [q, setQ] = React.useState("기생충");
  const [list, setList] = React.useState([]);

  const run = async () => {
    const res = await searchKobisByTitle(q, 1);
    setList(res.movieList || []);
  };

  React.useEffect(()=>{ run(); /* 초기 한번 */ }, []);

  // 간단 시각화: 제작연도별 개수
  const byYear = Object.values(
    list.reduce((acc, m)=>{
      const y = String(m.prdtYear || "기타");
      acc[y] = acc[y] || { year: y, count: 0 };
      acc[y].count += 1;
      return acc;
    }, {})
  ).sort((a,b)=> a.year.localeCompare(b.year));

  return (
    <Stack spacing={2}>
      <Typography variant="h6">KOBIS Open API 연동 (영화명 검색)</Typography>
      <Stack direction="row" spacing={1}>
        <TextField size="small" value={q} onChange={(e)=>setQ(e.target.value)} label="영화명" />
        <Button variant="contained" onClick={run}>검색</Button>
      </Stack>

      <Paper sx={{ p:2 }}>
        <Typography variant="subtitle1" gutterBottom>제작연도별 검색 결과 개수</Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byYear}>
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p:2 }}>
        <Typography variant="subtitle1">검색 결과 (상위 10개)</Typography>
        <ul style={{ margin: 0 }}>
          {(list || []).slice(0,10).map(m => (
            <li key={m.movieCd}>
              {m.movieNm} · {m.prdtYear} · {m.nationAlt} · {m.genreAlt}
            </li>
          ))}
        </ul>
      </Paper>
    </Stack>
  );
}
