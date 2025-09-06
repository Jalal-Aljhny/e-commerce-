import Grid from "@mui/material/Grid";
import CustomCard from "../components/Card";
import React from "react";
import HeroSection from "../components/Hero";
import Products from "./products/Products";

const Home = () => {
  return (
    <main style={{ marginBlock: "2rem" }}>
      <HeroSection />

      <Products />
    </main>
  );
};

export default Home;
