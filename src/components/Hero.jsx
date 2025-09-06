import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function HeroSection() {
  return (
    <Box
      sx={{
        height: "50vh",
        backgroundImage: `url('/hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 4rem",
        color: "white",
        textShadow: "2px 2px 10px rgba(0,0,0)",
        marginBlock: "2rem",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Enjoy the most delicious fresh dishes
      </Typography>
      <Typography variant="h5" sx={{ mb: 4, maxWidth: 500 }}>
        Authentic recipes, fresh ingredients
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{ fontWeight: "bold" }}
        href="/products"
      >
        Browse the list
      </Button>
    </Box>
  );
}
