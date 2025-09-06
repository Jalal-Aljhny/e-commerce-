import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import ShareIcon from "@mui/icons-material/Share";

export default function CustomCardSkeleton() {
  return (
    <Card
      sx={{
        maxWidth: 345,
        padding: "1rem",
        borderRadius: "1rem",
      }}
    >
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={
          <Skeleton
            variant="text"
            width="60%"
            height={30}
            sx={{
              fontWeight: "bold",
              fontSize: "1.25rem",
              fontStyle: "italic",
            }}
          />
        }
        subheader={<Skeleton variant="text" width="40%" />}
      />
      <Skeleton
        variant="rectangular"
        height={194}
        sx={{ borderRadius: "0.5rem" }}
      />
      <CardContent>
        <Skeleton variant="text" width="100%" />
        <Skeleton
          variant="text"
          width="40%"
          sx={{ marginLeft: "auto", textAlign: "right" }}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share" disabled>
          <ShareIcon />
        </IconButton>

        <Skeleton
          variant="rectangular"
          width={100}
          height={36}
          sx={{ marginLeft: "auto", borderRadius: "0.5rem" }}
        />
      </CardActions>
    </Card>
  );
}
