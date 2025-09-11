import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const RatingInput = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <Box display="flex" alignItems="center">
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          size="large"
          aria-label={`${star} Star`}
        >
          {star <= (hover || value) ? (
            <StarIcon color="primary" />
          ) : (
            <StarBorderIcon color="disabled" />
          )}
        </IconButton>
      ))}
    </Box>
  );
};

export default RatingInput;
