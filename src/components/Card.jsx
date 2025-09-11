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
import { useNavigate } from "react-router-dom";
export default function CustomCard({
  id,
  title,
  categories,
  // description,
  imageUrl,
  price,
  quantity,
  lastModified,
  onShare,
  onOpen,
}) {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        maxWidth: 345,
        padding: "1rem",
        borderRadius: "1rem",
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(`/products/${id}`);
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {/* {categories} */}
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          {/* <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "1rem",
              lineBreak: "anywhere",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {description}
          </Typography> */}
          <Typography
            sx={{
              padding: "0.25rem 0.75rem",
              borderRadius: "2rem",
              border: "1px solid #3335",
              width: "fit-content",
              // marginBlock: "1rem",
              transitionDuration: 300,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#333",
                color: "#fff",
              },
            }}
            onClick={() => navigate(`/categories?name=${categories}`)}
          >
            {categories}
          </Typography>
        </div>
        <div
          style={{
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
        </div>
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
