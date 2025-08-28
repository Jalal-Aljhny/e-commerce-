import Grid from "@mui/material/Grid";
import CustomCard from "../components/Card";
import React from "react";

const Home = () => {
  return (
    <main style={{ marginBlock: "2rem" }} className="boxContainer">
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}
      >
        {Array.from(Array(6)).map((_, index) => (
          <Grid
            key={index}
            size={{ xs: 2, sm: 4, md: 4 }}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            className="box"
          >
            <CustomCard imageUrl={"/book1.jpeg"} />
          </Grid>
        ))}
      </Grid>
    </main>
  );
};

export default Home;
