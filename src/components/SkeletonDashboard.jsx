import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Button,
  Chip,
} from "@mui/material";

const OrdersTableSkeleton = () => {
  // Number of rows to show in skeleton
  const skeletonRows = 4;

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {["Order ID", "Date", "Status", "Total Price", "Actions"].map(
              (header) => (
                <TableCell key={header}>
                  <Skeleton width={80} />
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(skeletonRows)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton width={40} />
              </TableCell>
              <TableCell>
                <Skeleton width={100} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} />
              </TableCell>
              <TableCell>
                <Skeleton width={60} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="rectangular" width={100} height={32} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTableSkeleton;
