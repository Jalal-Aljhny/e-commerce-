import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
  CircularProgress,
  Backdrop,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { MainContext } from "../../services/context/MainContext";
import RatingInput from "../../components/RatingInput";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import ProfileSkeleton from "./ProfileSkeleton";
import RatingDisplay from "../../components/RatingOutput";

const ProfilePage = () => {
  const { getUser, rateSeller, isAuth } = useContext(MainContext);
  const [user, setUser] = useState(null);
  const id = location.pathname.split("/")[2];
  const navigate = useNavigate();

  useEffect(() => {
    getUser(id).then((res) => {
      setUser(res.data.user);
    });
  }, [getUser, id]);
  const [rating, setRating] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        mb: 15,
      }}
    >
      {user ? (
        <Paper
          elevation={3}
          sx={{
            maxWidth: 400,
            width: "100%",
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 2,
              bgcolor: "primary.main",
            }}
            src={user?.image || "/profile.jpg"}
            alt={user?.name}
          >
            {!user?.image && <PersonIcon sx={{ fontSize: 60 }} />}
          </Avatar>

          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ textTransform: "capitalize" }}
          >
            {user?.name || "No Name Provided"}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {user?.bio || "No bio available."}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1} textAlign="left">
            <Typography variant="subtitle2" color="text.secondary">
              Email:
            </Typography>
            <Typography variant="body1">
              {user?.email || "Not provided"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mt={2}>
              Phone:
            </Typography>
            <Typography variant="body1">
              {user?.phone || "Not provided"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mt={2}>
              City:
            </Typography>
            <Typography variant="body1">
              {user?.city || "Not provided"}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mt={2}>
              Country:
            </Typography>
            <Typography variant="body1">
              {user?.country || "Not provided"}
            </Typography>
          </Stack>
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
              average={user?.ratings.average}
              count={user?.ratings.count}
              max={5}
            />
          </Box>
          {isAuth ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                marginBlock: "2rem",
                flexDirection: "column",
              }}
            >
              <div>
                <h3>Rate this seller:</h3>
                <RatingInput value={rating} onChange={setRating} />
                {rating ? <p>Your rating: {rating} of 5</p> : null}
              </div>

              {rating ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  onClick={async () => {
                    await rateSeller(user?.id, rating);
                    await getUser(id).then((res) => {
                      setUser(res.data.user);
                    });
                    setSnackbarOpen(true);
                    setRating(0);
                    window.scrollTo(0, 0);
                  }}
                  sx={{ marginBlock: "1rem" }}
                  disabled={!rating}
                >
                  Send Rate
                </Button>
              ) : null}
            </Box>
          ) : null}

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <Typography component="span">Seller latest products </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer
                component={Paper}
                sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
              >
                <List>
                  {user?.latestProducts.map(
                    ({
                      id,
                      title,

                      price,
                      image,
                      lastModified,
                    }) => (
                      <Fragment key={id}>
                        <ListItem
                          alignItems="center"
                          sx={{
                            py: 2,
                            transitionDuration: "300ms",
                            cursor: "pointer",
                            "&:hover": {
                              scale: 1.01,
                            },
                          }}
                          onClick={() => {
                            navigate(`/products/${id}`);
                          }}
                        >
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
                                >
                                  <small
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    Price :
                                  </small>
                                  $ {price.toFixed(2)}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <small
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    Last Modified :
                                  </small>
                                  {new Date(lastModified).toLocaleDateString()}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </Fragment>
                    )
                  )}
                </List>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Paper>
      ) : (
        <ProfileSkeleton />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Thank you for rating .
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
