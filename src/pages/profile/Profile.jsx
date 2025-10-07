import React, { useContext, useState } from "react";
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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { MainContext } from "../../services/context/MainContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => setOpenBackdrop(false);
  const handleOpenBackdrop = () => setOpenBackdrop(true);

  const { user, deleteUser, logout } = useContext(MainContext);
  const navigate = useNavigate();
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
          src={user.image || "/profile.jpg"}
          alt={user.name}
        >
          {!user.image && <PersonIcon sx={{ fontSize: 60 }} />}
        </Avatar>

        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ textTransform: "capitalize" }}
        >
          {user.name || "No Name Provided"}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {user.bio || "No bio available."}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={1} textAlign="left">
          <Typography variant="subtitle2" color="text.secondary">
            Email:
          </Typography>
          <Typography variant="body1">
            {user.email || "Not provided"}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" mt={2}>
            Phone:
          </Typography>
          <Typography variant="body1">
            {user.phone || "Not provided"}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" mt={2}>
            City:
          </Typography>
          <Typography variant="body1">{user.city || "Not provided"}</Typography>

          <Typography variant="subtitle2" color="text.secondary" mt={2}>
            Country:
          </Typography>
          <Typography variant="body1">
            {user.country || "Not provided"}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" mt={2}>
            Roles:
          </Typography>
          <Typography variant="body1">
            {user?.role?.length > 0
              ? user.role.join(", ")
              : "No roles assigned"}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginBlock: "2rem",
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ borderRadius: "1rem" }}
            onClick={() => {
              navigate(`/edit-profile/${user.id}`);
            }}
          >
            Update profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ borderRadius: "1rem" }}
            onClick={async () => {
              handleOpenBackdrop();
              await deleteUser(user.id);
              await logout();
              handleCloseBackdrop();
            }}
          >
            Delete profile
          </Button>
        </Box>
      </Paper>
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ProfilePage;
