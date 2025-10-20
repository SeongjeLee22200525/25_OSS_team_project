import * as React from "react";
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Rating, Button, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, onLike, onRate, onDelete }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia component="img" image={movie.posterUrl || "https://placehold.co/300x420?text=No+Image"} alt={movie.titleKo} height={420} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>{movie.titleKo}</Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.country} · {Array.isArray(movie.genre)? movie.genre.join(", ") : movie.genre} · {movie.releaseDate}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Rating value={Number(movie.rating) || 0} max={10} precision={0.5} onChange={(_, v)=>onRate(v)} />
          <Typography variant="caption">{movie.rating ?? 0}/10</Typography>
        </Stack>
      </CardContent>
      <CardActions>
        <IconButton onClick={onLike} color={movie.favorite ? "error" : "default"}>
          <FavoriteIcon />
        </IconButton>
        <Button component={Link} to={`/edit/${movie.id}`} startIcon={<EditIcon />}>수정</Button>
        <IconButton onClick={onDelete} color="error"><DeleteIcon /></IconButton>
      </CardActions>
    </Card>
  );
}
