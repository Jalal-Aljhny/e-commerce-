import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { convertDate } from "../../utils/convertDate";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../services/context/MainContext";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomCardSkeleton from "../../components/SkeletonCard";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import RatingInput from "../../components/RatingInput";
import RatingDisplay from "../../components/RatingOutput";
export default function Product() {
  const { productData, fetchProduct, isAuth, getUser, rateProduct } =
    useContext(MainContext);
  const id = location.pathname.split("/")[2];
  const isMount = useRef(false);
  useEffect(() => {
    if (!isMount.current) {
      fetchProduct(id);
      isMount.current = true;
    }
  }, [fetchProduct, id]);
  const [seller, setSeller] = useState();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (productData) {
      getUser(productData.userId).then((res) => {
        setSeller(res.data.user);
      });
    }
  }, [getUser, productData]);

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
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <Button
        variant="contained"
        color="success"
        aria-label="update"
        size="small"
        sx={{
          padding: " 0.5rem 1rem",
          position: "absolute",
          top: "5rem",
          left: "2rem",
        }}
        onClick={() => {
          navigate("/products");
        }}
      >
        <ArrowBackSharpIcon /> Back to products
      </Button>
      {productData ? (
        <Card
          sx={{
            width: "50%",
            padding: "1rem",
            borderRadius: "1rem",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            mb: "15rem",
            mt: "5rem",
          }}
        >
          <Typography
            sx={{
              padding: "0.25rem 0.75rem",
              borderRadius: "2rem",
              border: "1px solid #3335",
              width: "fit-content",
              // marginBlock: "1rem",
              fontWeight: "bold",
              fontStyle: "italic",
              transitionDuration: 300,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#333",
                color: "#fff",
              },
            }}
            onClick={() =>
              navigate(`/categories?name=${productData?.categories[0]?.name}`)
            }
          >
            {productData?.categories[0]?.name}
          </Typography>
          <CardHeader
            // avatar={
            //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            //     {productData?.categories[0]?.name}
            //   </Avatar>
            // }
            title={productData?.title}
            slotProps={{
              title: {
                fontWeight: "bold",
                fontSize: "1.5rem",
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
              variant="body2"
              sx={{
                color: "text.secondary",
                marginBlock: "1rem",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Created By :</span>
              <Box
                component={"span"}
                sx={{
                  transitionDuration: "300ms",
                  padding: "0.75rem",
                  borderRadius: "2rem",
                  "&:hover": {
                    boxShadow: "1px 1px 5px ",
                  },
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/seller/${seller.id}`);
                }}
              >
                {seller?.name}
              </Box>
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
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: "0.75rem",
                mt: 1,
              }}
            >
              Last update : {convertDate(productData?.lastModified)}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginBlock: "2rem",
              flexDirection: "column",
            }}
          >
            <RatingDisplay
              average={productData?.ratings.average}
              count={productData?.ratings.count}
              max={5}
            />
          </Box>
          <hr />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginBlock: "2rem",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div>
              <h3>Rate this seller:</h3>
              <RatingInput value={rating} onChange={setRating} />
              {rating ? <p>Your rating: {rating} of 5</p> : null}
            </div>
            {rating ? (
              <Button
                size="small"
                variant="outlined"
                color="info"
                onClick={async () => {
                  await rateProduct(productData?.id, rating);
                  await fetchProduct(id);
                  window.scrollTo(0, 0);
                  // setSnackbarOpen(true);
                  setRating(0);
                }}
                sx={{ marginBlock: "1rem" }}
                disabled={!rating}
              >
                Send Rate
              </Button>
            ) : null}
          </Box>
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
