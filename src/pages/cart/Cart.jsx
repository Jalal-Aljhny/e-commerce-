import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  TextField,
  CircularProgress,
  Backdrop,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { MainContext } from "../../services/context/MainContext";
import { useNavigate } from "react-router-dom";

export default function CartPage({ onClose, checkout }) {
  const {
    items,
    fetchCart,
    removeFromCart,
    updateItemQuantity,
    createOrder,
    fetchProduct,
    productData,
  } = useContext(MainContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  console.log(items);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  const handleOpen = async (itemId, currentQuantity, id) => {
    setEditingItemId(itemId); // cart item id
    setValue(String(currentQuantity));
    await fetchProduct(id); // product item id
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItemId(null);
    setValue("");
  };

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => setOpenBackdrop(false);
  const handleOpenBackdrop = () => setOpenBackdrop(true);

  const [openCheckoutBackdrop, setOpenCheckoutBackdrop] = useState(false);
  const handleCloseCheckoutBackdrop = () => setOpenCheckoutBackdrop(false);
  const handleOpenCheckoutBackdrop = () => setOpenCheckoutBackdrop(true);

  const totalPrice = items.reduce(
    (sum, item) => sum + item?.product.price * item?.quantity,
    0
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {items.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <List>
            {items.map(
              ({
                id: itemId,
                product: { id, title, price, image },
                quantity,
              }) => (
                <Fragment key={id}>
                  <ListItem alignItems="center" sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={image}
                        alt={title}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Price: ${price.toFixed(2)}
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <TextField
                              label="Quantity"
                              type="number"
                              size="small"
                              value={quantity}
                              disabled
                              inputProps={{ min: 1, style: { width: 60 } }}
                            />
                            <IconButton
                              edge="end"
                              aria-label="update"
                              sx={{ "&:hover": { color: "green" } }}
                              onClick={() => handleOpen(itemId, quantity, id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="remove"
                              onClick={async () => {
                                handleOpenBackdrop();
                                await removeFromCart(itemId);
                                handleCloseBackdrop();
                              }}
                              sx={{ "&:hover": { color: "red" } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </>
                      }
                    />
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ minWidth: 80, textAlign: "right" }}
                    >
                      ${(price * quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                  <Divider />
                </Fragment>
              )
            )}
          </List>

          {/* Dialog rendered once */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Enter new quantity</DialogTitle>
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
                  if (
                    val === "" ||
                    (/^[0-9]+$/.test(val) && val <= productData.quantity)
                  ) {
                    setValue(val);
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={async () => {
                  handleOpenBackdrop();
                  await updateItemQuantity(editingItemId, Number(value));
                  handleCloseBackdrop();
                  handleClose();
                }}
                disabled={!value.trim()}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>

          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={openBackdrop}
            onClick={handleCloseBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={openCheckoutBackdrop}
            // onClick={handleCloseCheckoutBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Total: ${totalPrice.toFixed(2)}
            </Typography>
            {checkout ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={async () => {
                  handleOpenCheckoutBackdrop();
                  await createOrder();
                  navigate("/checkout");
                  onClose();
                  handleCloseCheckoutBackdrop();
                }}
              >
                Checkout
              </Button>
            ) : null}
          </Box>
        </>
      )}
    </Container>
  );
}
