import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { convertDate } from "../utils/convertDate";
export default function CustomCard({
  id,
  title,
  categories,
  description,
  imageUrl,
  price,
  quantity,
  lastModified,
  onShare,
  onOpen,
}) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        padding: "1rem",
        borderRadius: "1rem",
        height: "480px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {categories}
          </Avatar>
        }
        title={title}
        // title="sprite"
        subheader={convertDate(lastModified)}
        slotProps={{
          title: {
            fontWeight: "bold",
            fontSize: "1.25rem",
            fontStyle: "italic",
          },
        }}
      />
      <CardMedia
        component="img"
        height="194"
        // image={"https://" + imageUrl.split("://")[1]}
        image={imageUrl}
        alt="Meal image"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            price : {price} $
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
            }}
          >
            quantity : {quantity}
          </Typography>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="share"
          onClick={() => {
            if (location.href.endsWith("/products")) {
              navigator.clipboard.writeText(location.href + `/${id}`);
            } else {
              navigator.clipboard.writeText(
                location.href + "products" + `/${id}`
              );
            }
            onShare();
          }}
        >
          <ShareIcon />
        </IconButton>

        <Button
          size="small"
          variant="outlined"
          color="#b4b4b4"
          sx={{
            marginLeft: "auto",
            fontWeight: "bold",
            transitionDuration: "300ms",
            "&:hover": {
              color: "white",
              backgroundColor: "#212121",
              borderColor: "white",
            },
          }}
          onClick={() => {
            onOpen();
          }}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
