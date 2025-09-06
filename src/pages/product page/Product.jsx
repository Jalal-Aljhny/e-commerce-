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
import { convertDate } from "../../utils/convertDate";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../services/context/MainContext";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomCardSkeleton from "../../components/SkeletonCard";
export default function Product() {
  const { productData, fetchProduct, isAuth } = useContext(MainContext);
  const id = location.pathname.split("/")[2];
  const isMount = useRef(false);
  useEffect(() => {
    if (!isMount.current) {
      fetchProduct(id);
      isMount.current = true;
    }
  }, [fetchProduct, id]);
  console.log(productData);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const handleShareClick = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  //
  const [open, setOpen] = useState(false);
  const [dialogValue, setDialgoValue] = useState("");
  const handleOpen = () => {
    if (!isAuth) {
      sessionStorage.setItem("pre_page", `/products/${id}`);
      navigate("/register");
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    setOpen(false);
    console.log("quantity : ", dialogValue);
    console.log("id : ", id);
  };
  //
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      {productData ? (
        <Card
          sx={{
            width: "300px",
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
                {productData?.categories[0]?.name}
              </Avatar>
            }
            title={productData?.title}
            // title="sprite"
            subheader={convertDate(productData?.lastModified)}
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
            image={productData?.image}
            alt="Meal image"
            sx={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {productData?.description}
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
                price : {productData?.price} $
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: "bold",
                }}
              >
                quantity : {productData?.quantity}
              </Typography>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label="share"
              onClick={() => {
                navigator.clipboard.writeText(location.href);
                // onShare();
                handleShareClick();
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
                handleOpen();
              }}
            >
              Add to cart
            </Button>
          </CardActions>
        </Card>
      ) : (
        <CustomCardSkeleton />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Link meal card copied !
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter a quantity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Quantity"
            type="text"
            fullWidth
            variant="outlined"
            value={dialogValue}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[0-9]+$/.test(val)) {
                setDialgoValue(val);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!dialogValue}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
