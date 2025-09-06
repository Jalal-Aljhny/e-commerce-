import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
  TextField,
} from "@mui/material";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  };

  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState(false);
  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,16}$/.test(val)) {
      // if (/^4\d{3}(-\d{4}){3}$/.test(val)) {
      setCardNumber(val);
      setError(val.length !== 16);
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
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 4, height: "80vh" }}
    >
      <Typography variant="h6" gutterBottom>
        Enter your payment details
      </Typography>
      <Box sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
        {/* <CardElement options={{ hidePostalCode: true }} /> */}
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
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment successful! Thank you.
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || success}
        sx={{ marginInline: "auto" }}
      >
        {loading ? <CircularProgress size={24} /> : "Pay Now"}
      </Button>
    </Box>
  );
}
