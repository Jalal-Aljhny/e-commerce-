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
} from "@mui/material";
import { convertDate } from "../utils/convertDate";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../services/context/MainContext";

// Map status to color for Chip component
const statusColors = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

const OrdersTable = () => {
  const { cancelOrder, userOrders, fetchCurrentUserOrder } =
    useContext(MainContext);

  useEffect(() => {
    fetchCurrentUserOrder();
  }, [fetchCurrentUserOrder]);
  const [loading, setLoading] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => setOpenBackdrop(false);
  const handleOpenBackdrop = () => setOpenBackdrop(true);
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 900, margin: "auto", mt: 15 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userOrders.map(({ id, createdAt, status, totalPrice }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{convertDate(createdAt)}</TableCell>
              <TableCell>
                <Chip
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  color={statusColors[status] || "default"}
                  variant="outlined"
                  sx={{ fontWeight: "bold" }}
                />
              </TableCell>
              <TableCell>${parseFloat(totalPrice).toFixed(2)}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={async () => {
                    handleOpenBackdrop();
                    setLoading(true);
                    await cancelOrder(id);
                    setLoading(false);
                    handleCloseBackdrop();
                  }}
                  disabled={loading}
                >
                  Cancel Order
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {userOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
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
