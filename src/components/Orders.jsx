import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Backdrop,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { convertDate } from "../utils/convertDate";
import { Fragment, useContext, useEffect, useState } from "react";
import { MainContext } from "../services/context/MainContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Map status to color for Chip component
const statusColors = {
  pending: "warning",
  cancellation_pending: "error",
  shipped: "info",
  paid: "success",
  cancelled: "error",
};

const OrdersTable = () => {
  const {
    cancelOrder,
    userOrders,
    fetchCurrentUserOrder,
    fetchOrderItems,
    createOrder,
    confirmOrder,
    lastOrderPage,
    currentOrderPage,
    loadMoreUserOrders,
  } = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchCurrentUserOrder();
  }, [fetchCurrentUserOrder]);

  const handleCloseBackdrop = () => setOpenBackdrop(false);
  const handleOpenBackdrop = () => setOpenBackdrop(true);
  const [orderItemsMap, setOrderItemsMap] = useState({});

  const toggleExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      // Collapse if already expanded
      setExpandedOrderId(null);
    } else {
      // Expand new order
      if (!orderItemsMap[orderId]) {
        // Fetch items if not already fetched
        const items = await fetchOrderItems(orderId);
        setOrderItemsMap((prev) => ({ ...prev, [orderId]: items }));
      }
      setExpandedOrderId(orderId);
    }
  };

  return (
    <TableContainer sx={{ maxWidth: 900, margin: "auto", mt: 15 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {/* <TableCell>Order ID</TableCell> */}
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                No orders found.
              </TableCell>
            </TableRow>
          )}

          {userOrders.map(({ id, createdAt, status, total }) => {
            const items = orderItemsMap[id] || [];
            return (
              <Fragment key={id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleExpand(id)}
                      aria-label={
                        expandedOrderId === id ? "Collapse" : "Expand"
                      }
                    >
                      {expandedOrderId === id ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  {/* <TableCell>{id}</TableCell> */}
                  <TableCell>{convertDate(createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      color={statusColors[status] || "default"}
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>${parseFloat(Number(total)).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      color="warning"
                      onClick={async () => {
                        handleOpenBackdrop();
                        setLoading(true);
                        await cancelOrder(id);
                        await fetchCurrentUserOrder();
                        setLoading(false);
                        handleCloseBackdrop();
                      }}
                      disabled={loading || status !== "pending"}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={async () => {
                        handleOpenBackdrop();
                        setLoading(true);
                        // await getClientSecretForOrder(id);
                        // await handleSubmitPayment();
                        await createOrder();
                        await confirmOrder(id);
                        await fetchCurrentUserOrder();
                        setLoading(false);
                        handleCloseBackdrop();
                      }}
                      disabled={loading || status !== "pending"}
                      sx={{ marginLeft: "1rem" }}
                    >
                      Confirm
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    {items.length > 0 ? (
                      <Collapse
                        in={expandedOrderId === id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                          >
                            Items
                          </Typography>
                          <Table size="small" aria-label="order-items">
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Total Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {items.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} align="center">
                                    No items found.
                                  </TableCell>
                                </TableRow>
                              )}
                              {items.map(
                                ({
                                  id: itemId,
                                  quantity,
                                  unitPrice,
                                  totalPrice,
                                  product,
                                }) => (
                                  <TableRow key={itemId}>
                                    <TableCell>
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                      >
                                        {product.image && (
                                          <img
                                            src={product.image}
                                            alt={product.title}
                                            style={{
                                              width: 50,
                                              height: 50,
                                              objectFit: "cover",
                                              borderRadius: 4,
                                            }}
                                          />
                                        )}
                                        <Typography>{product.title}</Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>{quantity}</TableCell>
                                    <TableCell>
                                      ${parseFloat(unitPrice).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      ${parseFloat(totalPrice).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    ) : null}
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
        {currentOrderPage < lastOrderPage ? (
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={loadMoreUserOrders}
            sx={{ margin: "2rem auto", display: "block" }}
          >
            Load More
          </Button>
        ) : null}
      </Table>

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
    </TableContainer>
  );
};

export default OrdersTable;
