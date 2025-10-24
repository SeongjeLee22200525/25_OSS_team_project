import * as React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import Home from "./pages/Home";
import OpenData from "./pages/OpenData";
import Add from "./add";
import Edit from "./edit";

export default function App() {
  const loc = useLocation();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🎬 Movie Archive
          </Typography>
          <Button component={Link} to="/" color={loc.pathname === "/" ? "primary" : "inherit"}>
            홈
          </Button>
          <Button component={Link} to="/add" color={loc.pathname === "/add" ? "primary" : "inherit"}>
            추가
          </Button>
          <Button component={Link} to="/open-data" color={loc.pathname === "/open-data" ? "primary" : "inherit"}>
            오픈데이터
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/open-data" element={<OpenData />} />
        </Routes>
      </Container>
    </Box>
  );
}
