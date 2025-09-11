import React from "react";
import { Avatar, Box, Typography, Paper, Divider, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ProfileSkeleton = () => {
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
            bgcolor: "grey.300",
          }}
        >
          <PersonIcon sx={{ fontSize: 60, color: "grey.500" }} />
        </Avatar>

        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            textTransform: "capitalize",
            bgcolor: "grey.300",
            height: 32,
            width: 180,
            mx: "auto",
            borderRadius: 1,
          }}
        >
          &nbsp;
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{
            bgcolor: "grey.300",
            height: 20,
            width: 250,
            mx: "auto",
            borderRadius: 1,
          }}
        >
          &nbsp;
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2} textAlign="left">
          <Box>
            <Typography
              variant="body1"
              sx={{
                bgcolor: "grey.300",
                height: 20,
                width: 250,
                borderRadius: 1,
              }}
            >
              &nbsp;
              <Typography
                variant="body1"
                sx={{
                  bgcolor: "grey.300",
                  height: 20,
                  width: 250,
                  borderRadius: 1,
                }}
              ></Typography>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfileSkeleton;
