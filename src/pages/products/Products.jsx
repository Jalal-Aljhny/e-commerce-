import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../services/context/MainContext";
import Card from "../../components/Card";
import CustomCardSkeleton from "../../components/SkeletonCard";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const Products = () => {
  const { products, loading, error, isAuth, addToCart } =
    useContext(MainContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleShareClick = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  const navigate = useNavigate();

  //
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [productId, setProductId] = useState(null);
  const handleOpen = () => {
    if (!isAuth) {
      navigate("/register");
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = async () => {
    await addToCart(productId, value);
    // alert(`You entered: ${value}`);
    setOpen(false);
  };
  //
  return (
    <section>
      {loading ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
          className="boxContainer"
        >
          {Array.from(Array(6)).map((_, index) => (
            <Grid key={index} className="box" size={{ xs: 2, sm: 4, md: 4 }}>
              <CustomCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : !loading && !error && products?.length ? (
        // products.map((product) => (
        // <Card
        //   key={product.id}
        //   title={product.title}
        //   categories={product.categories[0].name}
        //   description={product.description}
        //   imageUrl={product.image}
        //   price={product.price}
        //   quantity={product.quantity}
        //   lastModified={product.lastModified}
        // />
        // <Grid
        // container
        // spacing={{ xs: 2, md: 3 }}
        // columns={{ xs: 2, sm: 8, md: 12 }}
        // className="boxContainer"
        // >
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
          className="boxContainer"
        >
          {products.map((product, index) => (
            <Grid key={index} className="box" size={{ xs: 2, sm: 4, md: 4 }}>
              <Card
                id={product.id}
                key={product.id}
                title={product.title}
                categories={product.categories[0].name}
                description={product.description}
                imageUrl={product.image}
                price={product.price}
                quantity={product.quantity}
                lastModified={product.lastModified}
                onShare={handleShareClick}
                onOpen={() => {
                  handleOpen();
                  setProductId(product.id);
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : // categories, description, title, imageUrl;

      !loading && error ? (
        <small className="error">
          Error when getting products !!!... Return to home page ...
        </small>
      ) : null}
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message="Link meal card copied ! "
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      /> */}

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
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[0-9]+$/.test(val)) {
                setValue(val);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!value.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Products;
