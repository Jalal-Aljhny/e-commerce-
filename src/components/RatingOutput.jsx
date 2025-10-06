import { Box, Rating, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const RatingDisplay = ({
  average = 0,
  count = 0,
  max = 5,
  flexDir = "row",
  alignItems = "center",
}) => {
  const fullStars = Math.min(Math.max(average, 0), max);

  return (
    <Box
      display="flex"
      alignItems={alignItems}
      flexDirection={flexDir}
      marginBlock={flexDir == "column" ? "0.5rem" : null}
      gap={1}
    >
      <Box display="flex" alignItems="center">
        {/* {[...Array(max)].map((_, i) =>
          i < fullStars ? (
            <StarIcon key={i} color="primary" />
          ) : (
            <StarBorderIcon key={i} color="disabled" />
          )
        )} */}
        <Rating
          name="half-rating-read"
          defaultValue={0}
          value={average}
          precision={0.5}
          readOnly
        />
      </Box>
      <Typography variant="body2" color="textSecondary">
        {fullStars} / {max} ({count} {count === 1 ? "rating" : "ratings"})
      </Typography>
    </Box>
  );
};

export default RatingDisplay;
