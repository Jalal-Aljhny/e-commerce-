import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const RatingDisplay = ({ average = 0, count = 0, max = 5 }) => {
  const fullStars = Math.min(Math.max(average, 0), max);

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box display="flex" alignItems="center">
        {[...Array(max)].map((_, i) =>
          i < fullStars ? (
            <StarIcon key={i} color="primary" />
          ) : (
            <StarBorderIcon key={i} color="disabled" />
          )
        )}
      </Box>
      <Typography variant="body2" color="textSecondary">
        {fullStars} / {max} ({count} {count === 1 ? "rating" : "ratings"})
      </Typography>
    </Box>
  );
};

export default RatingDisplay;
