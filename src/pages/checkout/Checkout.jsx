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

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { handleSubmitPayment } = useContext(MainContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  };

  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState(false);
  const [errorStripe, setErrorStripe] = useState(false);
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
      onSubmit={handleSubmit}
      sx={{
        mt: 4,
        mb: 10,
        height: "80vh",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        paddingInline: "2rem",
      }}
    >
      <Box sx={{ width: "50%", mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Enter your payment details
        </Typography>
        <Box sx={{ mb: 2, border: "1px solid #ccc", borderRadius: 1 }}>
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
        {errorStripe && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorStripe}
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
          disabled={!cardNumber || loading || success}
          sx={{ marginInline: "auto" }}
          onClick={async () => {
            setLoading(true);
            await handleSubmitPayment()
              .then(() => {
                setSuccess(true);
                setLoading(false);
              })
              .catch((err) => {
                setSuccess(false);
                setErrorStripe(err.message);
                setLoading(false);
              });
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Place my order"}
        </Button>
      </Box>
      <Box sx={{ width: "50%" }}>
        <CartPage checkout={false} />
      </Box>
    </Box>
  );
}
