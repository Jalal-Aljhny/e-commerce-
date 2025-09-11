import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { convertDate } from "../../utils/convertDate";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../../services/context/MainContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  TableContainer,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomCardSkeleton from "../../components/SkeletonCard";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import RatingInput from "../../components/RatingInput";
import RatingDisplay from "../../components/RatingOutput";
export default function Product() {
  const {
    productData,
    fetchProduct,
    isAuth,
    getUser,
    rateProduct,
    addToCart,
    createComment,
    getComments,
    comments,
    deleteComment,
    user,
    updateComment,
    totalCommentsPages,
    currentCommenstPage,
  } = useContext(MainContext);
  const id = location.pathname.split("/")[2];
  const isMount = useRef(false);
  useEffect(() => {
    if (!isMount.current) {
      fetchProduct(id);
      isMount.current = true;
    }
  }, [fetchProduct, id]);
  useEffect(() => {
    getComments(id);
  }, [getComments, id]);
  const [seller, setSeller] = useState();
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentUsers, setCommentUsers] = useState({});

  useEffect(() => {
    if (!comments || comments.length === 0) return;

    const uniqueUserIds = [...new Set(comments.map((c) => c.userId))];

    Promise.all(
      uniqueUserIds.map((userId) =>
        getUser(userId).then((res) => ({ userId, user: res.data.user }))
      )
    ).then((results) => {
      const usersMap = {};
      results.forEach(({ userId, user }) => {
        usersMap[userId] = user;
      });
      setCommentUsers(usersMap);
    });
  }, [comments, getUser]);

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
  const [productId, setProductId] = useState(null);
  const [loadingCircle, setLoadingCircle] = useState(false);
  const handleSave = async () => {
    setLoadingCircle(true);
    await addToCart(productId, dialogValue);
    // alert(`You entered: ${value}`);
    setOpen(false);
    setLoadingCircle(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      await getComments(id);
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [loadingEditCircle, setLoadingEditCircle] = useState();
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
    setEditingComment(true);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleSaveEdit = async (commentId) => {
    setLoadingEditCircle(true);
    if (!editingCommentContent.trim()) return;

    try {
      await updateComment(id, commentId, editingCommentContent.trim()); // implement this in your context/api
      await getComments(id); // refresh comments
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (error) {
      console.error("Failed to update comment", error);
    }
    setLoadingEditCircle(false);
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
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate(`/categories?name=${productData?.categories[0]?.name}`);
            }}
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
              <span style={{ fontWeight: "bold" }}>Added By :</span>
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
              onClick={(e) => {
                // onShare();
                e.stopPropagation();
                e.preventDefault();
                navigator.clipboard.writeText(location.href);
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
                setProductId(productData.id);
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
          {isAuth ? <hr /> : null}

          {isAuth ? (
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
                <h3>Rate this product:</h3>
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
              {isAuth ? (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    id="panel4-header"
                  >
                    <Typography component="span">Comments </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer
                      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
                    >
                      <Box sx={{ mt: 3, width: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                          Add a comment
                        </Typography>
                        <TextField
                          multiline
                          minRows={3}
                          fullWidth
                          variant="outlined"
                          placeholder="Write your comment here..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          disabled={submitting}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={
                            // handleCommentSubmit
                            // console.log(newComment)
                            async () => {
                              setSubmitting(true);
                              await createComment(id, newComment);
                              await getComments(id);
                              setSubmitting(false);
                              setNewComment("");
                            }
                          }
                          disabled={submitting || !newComment.trim()}
                        >
                          {submitting ? "Submitting..." : "Submit Comment"}
                        </Button>

                        <Box sx={{ mt: 4, width: "100%" }}>
                          {comments.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              No comments yet.
                            </Typography>
                          ) : (
                            comments.map(
                              ({ id, userId, lastModify, content }) => {
                                const isEditing = editingCommentId === id;
                                const isOwner = user.id === userId;
                                return (
                                  <Box
                                    key={id}
                                    sx={{
                                      mb: 2,
                                      p: 2,
                                      borderRadius: 2,
                                      backgroundColor: "#f5f5f5",
                                      boxShadow: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      By :{" "}
                                      {commentUsers[userId]?.name ||
                                        "Loading..."}
                                      <Typography
                                        component="span"
                                        sx={{
                                          fontWeight: "normal",
                                          color: "text.secondary",
                                          ml: 1,
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        {new Date(
                                          lastModify
                                        ).toLocaleDateString()}
                                      </Typography>
                                      {isOwner && (
                                        <Box>
                                          {isEditing ? (
                                            <>
                                              <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                  handleSaveEdit(id)
                                                }
                                                aria-label="save"
                                                disabled={loadingEditCircle}
                                              >
                                                {loadingEditCircle ? (
                                                  <CircularProgress size={24} />
                                                ) : (
                                                  <SaveIcon fontSize="small" />
                                                )}
                                              </IconButton>
                                              <IconButton
                                                size="small"
                                                color="inherit"
                                                onClick={handleCancelEdit}
                                                aria-label="cancel"
                                                disabled={loadingCircle}
                                              >
                                                <CancelIcon fontSize="small" />
                                              </IconButton>
                                            </>
                                          ) : (
                                            <>
                                              <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() =>
                                                  handleStartEdit({
                                                    id,
                                                    content,
                                                  })
                                                }
                                                aria-label="edit"
                                              >
                                                <EditIcon fontSize="small" />
                                              </IconButton>
                                              <IconButton
                                                size="small"
                                                color="error"
                                                onClick={async () => {
                                                  setLoadingCircle(true);
                                                  await handleDeleteComment(id);
                                                  setLoadingCircle(false);
                                                }}
                                                aria-label="delete"
                                                disabled={loadingCircle}
                                              >
                                                {loadingCircle ? (
                                                  <CircularProgress size={24} />
                                                ) : (
                                                  <DeleteIcon fontSize="small" />
                                                )}
                                              </IconButton>
                                            </>
                                          )}
                                        </Box>
                                      )}
                                    </Typography>

                                    {isEditing ? (
                                      <TextField
                                        multiline
                                        minRows={3}
                                        fullWidth
                                        variant="outlined"
                                        value={editingCommentContent}
                                        onChange={(e) =>
                                          setEditingCommentContent(
                                            e.target.value
                                          )
                                        }
                                        disabled={loadingCircle}
                                        sx={{ mt: 1 }}
                                      />
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{ textAlign: "left", mt: 1 }}
                                      >
                                        {content}
                                      </Typography>
                                    )}
                                  </Box>
                                );
                              }
                            )
                          )}
                          {currentCommenstPage < totalCommentsPages && (
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() =>
                                getComments(id, currentCommenstPage + 1, true)
                              }
                            >
                              Next
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ) : null}
            </Box>
          ) : null}
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
          <Button
            onClick={handleSave}
            disabled={!dialogValue.trim() || loadingCircle}
          >
            {loadingCircle ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
