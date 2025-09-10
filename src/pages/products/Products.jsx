import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../services/context/MainContext";
import Card from "../../components/Card";
import CustomCardSkeleton from "../../components/SkeletonCard";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const Products = () => {
  const {
    products,
    loading,
    error,
    isAuth,
    addToCart,
    searchProducts,
    srchProducts,
    mode,
    handleMode,
  } = useContext(MainContext);
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
  const [maxQuantity, setMaxQuantity] = useState();
  useEffect(() => {
    if (productId) {
      let product = products.find((p) => p.id == productId);
      setMaxQuantity(product.quantity);
    }
  }, [productId, products]);
  const handleOpen = () => {
    setValue("");
    if (!isAuth) {
      navigate("/register");
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [loadingCircle, setLoadingCircle] = useState(false);
  const handleSave = async () => {
    setLoadingCircle(true);
    await addToCart(productId, value);
    // alert(`You entered: ${value}`);
    setOpen(false);
    setLoadingCircle(false);
  };
  //
  const [query, setQuery] = useState("");
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setQuery("");
        handleMode("normal");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMode]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => setOpenBackdrop(false);
  const handleOpenBackdrop = () => setOpenBackdrop(true);

  console.log("products : ", products);
  return (
    <section style={{ marginBottom: "15rem" }}>
      {mode == "search" ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            maxWidth: "80%",
            marginInline: "auto",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={async () => {
              handleOpenBackdrop();
              await searchProducts(query);
              handleCloseBackdrop();
            }}
          >
            Search
          </Button>
          <IconButton
            aria-label="clear search"
            onClick={() => {
              setQuery("");
              handleMode("normal");
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ) : null}
      {loading ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
          className="boxContainer"
          sx={{ alignItems: "stretch", justifyContent: "center" }}
        >
          {Array.from(Array(6)).map((_, index) => (
            <Grid key={index} className="box" size={{ xs: 2, sm: 4, md: 4 }}>
              <CustomCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : mode == "search" && srchProducts?.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
          className="boxContainer"
          sx={{ alignItems: "stretch", justifyContent: "center" }}
        >
          {srchProducts.map((product, index) => (
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
      ) : mode == "search" && srchProducts?.length == 0 ? (
        <small
          className="error"
          style={{
            display: "block",
            marginInline: "auto",
            marginBlock: "2rem",
          }}
        >
          No products found contains this title ...!
        </small>
      ) : !loading && !error && products?.length && mode == "normal" ? (
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
          sx={{ alignItems: "stretch", justifyContent: "center" }}
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

      !loading && error && mode == "normal" ? (
        <small
          className="error"
          style={{
            display: "block",
            marginInline: "auto",
            marginBlock: "2rem",
          }}
        >
          Error when getting products !!!... Return to home page ...
        </small>
      ) : !loading && !error && !products?.length && mode == "normal" ? (
        <small className="error">No products available !</small>
      ) : null}

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
          Product link copied !
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
              if (val === "" || (/^[0-9]+$/.test(val) && val <= maxQuantity)) {
                setValue(val);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!value.trim() || loadingCircle}
          >
            {loadingCircle ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  );
};

export default Products;
