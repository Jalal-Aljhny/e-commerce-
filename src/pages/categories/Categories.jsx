import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../services/context/MainContext";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import CustomCard from "../../components/Card";
import { useLocation, useNavigate } from "react-router-dom";

export default function LabTabs() {
  const { categories, products, isAuth, addToCart } = useContext(MainContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [value, setValue] = useState(queryParams.get("name"));

  function updateSearchParamName(newName) {
    const url = new URL(window.location);
    url.searchParams.set("name", newName);
    window.history.replaceState({}, "", url);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    updateSearchParamName(newValue);
  };

  const [productId, setProductId] = useState("");
  const [maxQuantity, setMaxQuantity] = useState();
  useEffect(() => {
    if (productId) {
      let product = products.find((p) => p.id == productId);
      setMaxQuantity(product.quantity);
    }
  }, [productId, products]);
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
  const handleOpen = async () => {
    setDialgoValue("");
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
    await addToCart(productId, dialogValue);
    setOpen(false);
    setLoadingCircle(false);
  };
  //
  return (
    <Box sx={{ width: "100%", typography: "body1", marginBottom: "15rem" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {categories.map((category, index) => (
              <Tab
                key={category.id}
                label={category.name}
                value={categories[index].name}
              />
            ))}
          </TabList>
        </Box>
        {categories.map((category, index) => (
          <TabPanel value={categories[index].name} key={category.id}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 2, sm: 8, md: 12 }}
              className="boxContainer"
            >
              {products.filter(
                (product) => product.categories[0].name == category.name
              ).length > 0 ? (
                products
                  .filter(
                    (product) => product.categories[0].name == category.name
                  )
                  .map((product, index) => (
                    <Grid
                      key={index}
                      className="box"
                      size={{ xs: 2, sm: 4, md: 4 }}
                    >
                      <CustomCard
                        id={product.id}
                        key={product.id}
                        title={product.title}
                        categories={product.categories[0].name}
                        // description={product.description}
                        imageUrl={product.image}
                        price={product.price}
                        quantity={product.quantity}
                        lastModified={product.lastModified}
                        seller={product.seller}
                        onShare={handleShareClick}
                        onOpen={() => {
                          setProductId(product.id);
                          handleOpen();
                        }}
                      />
                    </Grid>
                  ))
              ) : (
                <p
                  style={{
                    color: "green",
                    padding: "2rem",
                  }}
                >
                  No products in this category name !!
                </p>
              )}
            </Grid>
          </TabPanel>
        ))}
      </TabContext>

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
            value={dialogValue}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || (/^[0-9]+$/.test(val) && val <= maxQuantity)) {
                setDialgoValue(val);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!dialogValue || loadingCircle}>
            {loadingCircle ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
