import { Fragment, useContext, useEffect, useState } from "react";
import { MainContext } from "../../services/context/MainContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import OrdersTable from "../../components/Orders";
import { convertDate } from "../../utils/convertDate";

const statusColors = {
  pending: "warning",
  cancellation_pending: "error",
  shipped: "info",
  paid: "success",
  cancelled: "error",
};

const Dashboard = () => {
  const {
    users,
    // user,
    getUsers,
    updateUserName,
    updateUserRole,
    deleteUser,
    getUser,
    products,
    deleteProduct,
    categories,
    addCategory,
    updateGategory,
    removeGategory,
    allOrders,
    getOrders,
    cancelOrder,
    fetchOrderItems,
    getClientSecretForOrder,
    handleSubmitPayment,
  } = useContext(MainContext);

  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
  useEffect(() => {
    getOrders();
  }, [getOrders]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleUpdateName = async () => {
    setLoading(true);
    handleOpenBackdrop();
    try {
      await updateUserName(editingItemId, value);
      console.log(editingItemId, value);
    } catch (error) {
      console.error(error);
    }
    handleCloseBackdrop();
    setLoading(false);
    handleClose();
  };

  const handleUpdateRole = async () => {
    setLoading(true);
    handleOpenBackdrop();
    try {
      await updateUserRole(editingItemId, roleValue);
      console.log(editingItemId, roleValue);
    } catch (error) {
      console.error(error);
    }
    handleCloseBackdrop();
    setLoading(false);
    handleClose();
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  // const handleOpen = (itemId, currentName) => {
  //   setEditingItemId(itemId);
  //   setValue(String(currentName));
  //   console.log(itemId, currentName);
  //   setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
    setEditingItemId(null);
    setValue("");
  };

  // const [role, setRole] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [openRole, setOpenRole] = useState(false);
  const handleOpenRole = (itemId, currentRole) => {
    setEditingItemId(itemId);
    setRoleValue(String(currentRole));
    console.log(itemId, currentRole);
    setOpenRole(true);
  };
  const handleCloseRole = () => {
    setOpenRole(false);
    setEditingItemId(null);
    setRoleValue("");
  };

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => setOpenBackdrop(false);
  const handleOpenBackdrop = () => setOpenBackdrop(true);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const [userInfoMap, setUserInfoMap] = useState({});
  useEffect(() => {
    async function fetchUsersInfo() {
      const map = {};
      for (const product of products) {
        if (!map[product.userId]) {
          const res = await getUser(product.userId);
          map[product.userId] = res?.data.user;
        }
      }
      setUserInfoMap(map);
    }
    fetchUsersInfo();
  }, [products, getUser]);

  const [openCat, setOpenCat] = useState(false);
  const [valueCat, setValueCat] = useState("");
  const handleCloseCat = () => setOpenCat(false);
  const handleOpenCat = () => setOpenCat(true);

  const [openCatUp, setOpenCatUp] = useState(false);
  const [category_id, setCategory_id] = useState(null);
  const [valueCatUp, setValueCatUp] = useState("");
  const handleCloseCatUp = () => setOpenCatUp(false);
  const handleOpenCatUp = () => setOpenCatUp(true);

  const handleUpdateCat = (id, currentCat) => {
    handleOpenCatUp();
    setValueCatUp(currentCat);
    setCategory_id(id);
  };
  return (
    <section style={{ marginBottom: "15rem" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Users </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(({ id, name, email, role }) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>

                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>
                      {role?.includes("Super Admin") ? "Super Admin" : "User"}
                      <IconButton
                        edge="end"
                        aria-label="update"
                        sx={{
                          "&:hover": { color: "green" },
                        }}
                        onClick={() => handleOpenRole(id, role)}
                        disabled={role?.includes("Super Admin")}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {/* <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        sx={{ mr: 1, fontWeight: "bold" }}
                        onClick={() => handleOpen(id, name)}
                        // onClick={() => navigate(`/edit-profile/${id}`)}
                        disabled={
                          role?.includes("Super Admin") && id != user.id
                        }
                      >
                        Update
                      </Button> */}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                        onClick={async () => {
                          handleOpenBackdrop();
                          await deleteUser(id);
                          handleCloseBackdrop();
                        }}
                        disabled={role?.includes("Super Admin")}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Products </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            variant="contained"
            color="success"
            aria-label="update"
            sx={{
              // "&:hover": { color: "green" },
              padding: "1rem",
            }}
            // onClick={() => handleOpen(itemId, quantity)}
            onClick={() => {
              navigate("/add-product");
            }}
          >
            <AddIcon /> Add new product
          </Button>
          <List>
            {products.map(
              ({
                id,
                title,
                description,
                price,
                quantity,
                image,
                lastModified,
                userId,
              }) => (
                <Fragment key={id}>
                  <ListItem alignItems="center" sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={image}
                        alt={title}
                        sx={{
                          width: 120,
                          height: 120,
                          mr: 2,
                          objectFit: "contain",
                        }}
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: "bold", fontSize: "1rem" }}
                          >
                            {description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <small
                              style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                            >
                              Price :
                            </small>
                            $ {price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <small
                              style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                            >
                              Quantity :
                            </small>
                            {quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <small
                              style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                            >
                              Last Modified :
                            </small>
                            :{new Date(lastModified).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <small
                              style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                            >
                              User information:
                            </small>
                            <small
                              style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                            >
                              Name :
                            </small>
                            {userInfoMap[userId]?.name || "Loading..."},
                            <small
                              style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                            >
                              Email :
                            </small>
                            {userInfoMap[userId]?.email || "Loading..."}
                          </Typography>
                          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                            <IconButton
                              edge="end"
                              aria-label="update"
                              sx={{ "&:hover": { color: "green" } }}
                              onClick={() => {
                                navigate(`/edit-product/${id}`);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              sx={{ "&:hover": { color: "red" } }}
                              onClick={async () => {
                                handleOpenBackdrop();
                                await deleteProduct(id);
                                handleCloseBackdrop();
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </Fragment>
              )
            )}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography component="span">Categories </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
          >
            <Button
              variant="contained"
              color="success"
              aria-label="update"
              sx={{
                padding: "1rem",
              }}
              onClick={() => {
                handleOpenCat();
              }}
            >
              <AddIcon /> Add new Category
            </Button>
            <List>
              {categories.map(({ id, name }) => (
                <Fragment key={id}>
                  <ListItem
                    alignItems="center"
                    sx={{
                      py: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <small style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                        Category name :
                      </small>
                      {name}
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <IconButton
                        edge="end"
                        aria-label="update"
                        sx={{ "&:hover": { color: "green" } }}
                        onClick={() => {
                          // navigate(`/edit-product/${id}`);
                          handleUpdateCat(id, name);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        sx={{ "&:hover": { color: "red" } }}
                        onClick={async () => {
                          handleOpenBackdrop();
                          await removeGategory(id);
                          handleCloseBackdrop();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider />
                </Fragment>
              ))}
            </List>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography component="span">My orders </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
          >
            <OrdersTable />
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      {/* //TODO show order data */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          <Typography component="span">All orders </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 900, margin: "auto", mt: 15 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}

                {allOrders.map(({ id, createdAt, status, totalPrice }) => {
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
                        <TableCell>{id}</TableCell>
                        <TableCell>{convertDate(createdAt)}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              status.charAt(0).toUpperCase() + status.slice(1)
                            }
                            color={statusColors[status] || "default"}
                            variant="outlined"
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell>
                          ${parseFloat(totalPrice).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            color="warning"
                            onClick={async () => {
                              handleOpenBackdrop();
                              setLoading(true);
                              await cancelOrder(id);
                              await getOrders();
                              setLoading(false);
                              handleCloseBackdrop();
                            }}
                            disabled={loading || status !== "pending"}
                          >
                            Cancel Order
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={async () => {
                              handleOpenBackdrop();
                              setLoading(true);
                              await getClientSecretForOrder(id);
                              await handleSubmitPayment();
                              await fetchCurrentUserOrder();
                              setLoading(false);
                              handleCloseBackdrop();
                            }}
                            disabled={loading || status !== "pending"}
                            sx={{ marginLeft: "1rem" }}
                          >
                            Checkout
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
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
                                            <Typography>
                                              {product.title}
                                            </Typography>
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
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
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
        </AccordionDetails>
      </Accordion>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter new Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            variant="outlined"
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[a-zA-Z]/.test(val)) {
                setValue(val);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={
              handleUpdateName
              //   async () => {
              //   handleOpenBackdrop();
              //   // await updateItemQuantity(editingItemId, Number(value));
              //   await updateUserName(editingItemId, value);
              //   console.log(editingItemId, value);

              //   handleCloseBackdrop();
              //   handleClose();
              // }
            }
            disabled={!value.trim() || loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={16} /> : null
            }
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openRole} onClose={handleCloseRole}>
        <DialogTitle>Enter new Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roleValue}
              label="Role"
              onChange={(e) => {
                setRoleValue(e.target.value);
              }}
            >
              <MenuItem value={"Super Admin"}>Super User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRole}>Cancel</Button>
          <Button
            onClick={handleUpdateRole}
            disabled={!roleValue.trim() || loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={16} /> : null
            }
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCat} onClose={handleCloseCat}>
        <DialogTitle>Enter new Category</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              label="New Category"
              type="text"
              fullWidth
              variant="outlined"
              value={valueCat}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^[a-zA-Z]/.test(val)) {
                  setValueCat(val);
                }
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCat}>Cancel</Button>
          <Button
            onClick={async () => {
              setLoading(true);
              handleOpenBackdrop();
              await addCategory(valueCat);
              handleCloseBackdrop();
              setLoading(false);
              handleCloseCat();
            }}
            disabled={!valueCat.trim() || loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={16} /> : null
            }
          >
            {loading ? "Updating..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCatUp} onClose={handleCloseCatUp}>
        <DialogTitle>Enter new Category</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              label="Update Category"
              type="text"
              fullWidth
              variant="outlined"
              value={valueCatUp}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^[a-zA-Z]/.test(val)) {
                  setValueCatUp(val);
                }
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCatUp}>Cancel</Button>
          <Button
            onClick={async () => {
              setLoading(true);

              await updateGategory(category_id, valueCatUp);
              setLoading(false);
              handleCloseCatUp();
            }}
            disabled={!valueCatUp.trim() || loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={16} /> : null
            }
          >
            {loading ? "Updating..." : "Update"}
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
    </section>
  );
};

export default Dashboard;
