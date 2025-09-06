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
} from "@mui/material";
import { convertDate } from "../utils/convertDate";

// Map status to color for Chip component
const statusColors = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

const OrdersTable = () => {
  const orders = [
    { id: 4, createdAt: "2025-09-04", status: "pending", totalPrice: "401.80" },
    { id: 5, createdAt: "2025-08-20", status: "shipped", totalPrice: "120.00" },
    {
      id: 6,
      createdAt: "2025-07-15",
      status: "delivered",
      totalPrice: "89.99",
    },
    {
      id: 7,
      createdAt: "2025-06-10",
      status: "cancelled",
      totalPrice: "59.50",
    },
  ];
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
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
          {orders.map(({ id, createdAt, status, totalPrice }) => (
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
                  //   onClick={() => alert(`View details for order ${id}`)}
                  disabled
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
