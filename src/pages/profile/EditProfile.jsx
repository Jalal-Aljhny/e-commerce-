import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useForm, Controller } from "react-hook-form";
import { MainContext } from "../../services/context/MainContext";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const {
    getUser,
    updateUserData,
    role,
    user: userRegistered,
    checkAuth,
  } = useContext(MainContext);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleShareClick = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  const id = location.pathname.split("/")[2];
  const [user, setUser] = useState(null);
  const [roleValue, setRoleValue] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    register,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      bio: "",
      imageFile: null,
      role: "",
    },
  });

  useEffect(() => {
    if (id) {
      getUser(id)
        .then((res) => {
          setUser(res.data.user);
          const initialRole =
            res.data.user.role && res.data.user.role.length > 0
              ? res.data.user.role[0]
              : "";
          setRoleValue(initialRole);
          if (res.data.user.image) {
            setImagePreview(res.data.user.image);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [getUser, id, reset]);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        country: user.country || "",
        bio: user.bio || "",
        imageFile: null,
        role: user.role && user.role.length > 0 ? user.role[0] : "",
      });
      setRoleValue(user.role && user.role.length > 0 ? user.role[0] : "");
      setImagePreview(user.image || null);
      setIsReady(true);
    }
  }, [user, reset]);
  useEffect(() => {
    setValue("role", roleValue);
  }, [roleValue, setValue]);

  const handleImageChange = (file) => {
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedImageFile(file);
    } else {
      setImagePreview(null);
      setSelectedImageFile(null);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await updateUserData(
        id,
        data.name,
        data.email,
        selectedImageFile,
        data.bio,
        data.city,
        data.country,
        data.phone
      );
      handleShareClick();
    } finally {
      setLoading(false);

      if (role == "super") {
        navigate("/dashboard");
      } else {
        await navigate("/profile");
        window.location.reload();
      }
    }
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
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        {/* Avatar preview */}
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            bgcolor: "primary.main",
          }}
          src={imagePreview || undefined}
          alt={user?.name || "Profile"}
        >
          {!imagePreview && <PersonIcon sx={{ fontSize: 60 }} />}
        </Avatar>

        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
          Edit Profile
        </Typography>
        {!isReady ? (
          <Typography>Loading...</Typography>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} textAlign="left">
              <TextField
                label="Name"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />

              <TextField
                label="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />

              <TextField
                label="Phone"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
              />

              <TextField
                label="City"
                {...register("city")}
                error={!!errors.city}
                helperText={errors.city?.message}
                fullWidth
              />

              <TextField
                label="Country"
                {...register("country")}
                error={!!errors.country}
                helperText={errors.country?.message}
                fullWidth
              />

              <TextField
                label="Bio"
                multiline
                rows={3}
                {...register("bio")}
                error={!!errors.bio}
                helperText={errors.bio?.message}
                fullWidth
              />

              <Controller
                name="imageFile"
                control={control}
                rules={{
                  // Optional: require image file if you want
                  // required: "Image is required",
                  validate: (file) => {
                    if (file && file.length > 0) {
                      const validTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/svg+xml",
                        "image/webp",
                      ];
                      return (
                        validTypes.includes(file[0].type) ||
                        "Unsupported image format"
                      );
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ mt: 1 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          field.onChange(e.target.files);
                          handleImageChange(file);
                        }}
                      />
                    </Button>
                    {errors.imageFile && (
                      <FormHelperText error>
                        {errors.imageFile.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />

              {/* Role select: hide if user has "Super Admin" role */}
              {/* {userRegistered?.role?.includes("Super Admin") ? (
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={roleValue}
                    label="Role"
                    onChange={(e) => setRoleValue(e.target.value)}
                  >
                    <MenuItem value="Super Admin">Super Admin</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {errors.role.message}
                    </Typography>
                  )}
                </FormControl>
              ) : null} */}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isSubmitting || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </form>
        )}
      </Paper>
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
          Profile updates successfully !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfilePage;
