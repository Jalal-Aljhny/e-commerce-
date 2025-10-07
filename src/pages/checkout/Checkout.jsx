import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
  TextField,
} from "@mui/material";
import CartPage from "../cart/Cart";
import { MainContext } from "../../services/context/MainContext";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const { confirmOrder, stripeSuccess, stripeError, fetchProducts, fetchCart } =
    useContext(MainContext);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cardNumber: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.cardNumber.length !== 16) {
      setLoading(false);
      return;
    }
    try {
      // await handleSubmitPayment();
      await confirmOrder();
      await fetchProducts();
      await fetchCart();
      if (!stripeError) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // Test PaymentMethod ID |  Description
  // pm_card_visa : Successful Visa card payment
  // pm_card_mastercard : Successful Mastercard payment
  // pm_card_amex : Successful American Express payment
  // pm_card_chargeDeclined : Simulates a declined card payment
  // pm_card_authenticationRequired : Simulates 3D Secure authentication required
  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        mt: 4,
        mb: 10,
        height: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "center" },
        flexDirection: { xs: "column", md: "row" },
        paddingInline: "2rem",
      }}
    >
      <Box sx={{ width: "50%", mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Enter your payment details
        </Typography>
        {/* <Box sx={{ mb: 2, border: "1px solid #ccc", borderRadius: 1 }}>
          <TextField
            label="Card Number"
            value={cardNumber}
            onChange={handleChange}
            error={error}
            helperText={error ? "Card number must be 16 digits" : ""}
            inputProps={{ maxLength: 16 }}
            variant="outlined"
            fullWidth
          />
        </Box> */}

        <Box sx={{ mb: 2, border: "1px solid #ccc", borderRadius: 1 }}>
          <Controller
            name="cardNumber"
            control={control}
            rules={{
              required: "Card number is required",
              pattern: {
                value: /^\d{16}$/,
                message: "Card number must be exactly 16 digits",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Card Number"
                error={!!errors.cardNumber}
                helperText={errors.cardNumber ? errors.cardNumber.message : ""}
                inputProps={{ maxLength: 16 }}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,16}$/.test(val)) {
                    field.onChange(val);
                  }
                }}
              />
            )}
          />
        </Box>
        {/* {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )} */}
        {stripeError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {stripeError}
          </Alert>
        )}
        {stripeSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Payment successful! Thank you.
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || stripeSuccess}
          sx={{ marginInline: "auto" }}
          // onClick={async () => {
          //   setLoading(true);
          //   await handleSubmitPayment();
          //   await fetchProducts();
          //   await fetchCart();
          //   setLoading(false);
          // }}
        >
          {loading ? <CircularProgress size={24} /> : "Place my order"}
        </Button>
      </Box>
      <Box sx={{ width: { sx: "80%", md: "50%" } }}>
        <CartPage checkout={false} />
      </Box>
    </Box>
  );
}
