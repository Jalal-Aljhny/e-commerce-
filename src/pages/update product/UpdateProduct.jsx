import { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Stack,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { MainContext } from "../../services/context/MainContext";
import { useNavigate } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditProductForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    // setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      quantity: "",
      categories: [],
      imageFile: null,
    },
  });

  const { updateProduct, fetchProduct, productData, categories } =
    useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const id = location.pathname.split("/")[2];
  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  useEffect(() => {
    if (productData) {
      reset({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity,
        categories: productData.categories?.[0]?.name,
        imageFile: null,
      });
    }
  }, [productData, reset]);
  const onFormSubmit = async (data) => {
    setLoading(true);
    await updateProduct(
      id,
      data.title,
      data.description,
      data.quantity,
      data.price,
      [data.categories],
      image
    );
    setLoading(false);
    navigate("/products");
    window.scrollTo(0, 0);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 15 }}>
      <Typography variant="h4" gutterBottom>
        Update Product
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Controller
          name="title"
          control={control}
          rules={{
            required: "Title is required",
            validate: (value) =>
              /^[a-zA-Z]/.test(value) || "Title started with letter",
            maxLength: {
              value: 50,
              message: "Title cannot exceed 50 characters",
            },
            minLength: {
              value: 2,
              message: "Title should be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          rules={{
            required: "Description is required",
            validate: (value) =>
              /^[a-zA-Z]/.test(value) || "Description started with letter",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        {/* Categories */}
        <Controller
          name="categories"
          control={control}
          rules={{
            required: "Please select a category",
          }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.categories}>
              <InputLabel id="categories-label">Categories</InputLabel>
              <Select
                {...field}
                labelId="categories-label"
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (selected ? selected : "")}
                MenuProps={MenuProps}
              >
                {categories?.length > 0
                  ? categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              <FormHelperText>{errors.categories?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Controller
          name="price"
          control={control}
          rules={{
            required: "Price is required",
            min: { value: 0, message: "Price must be at least 0" },
            validate: (value) =>
              !isNaN(parseFloat(value)) || "Price must be a number",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Price ($)"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          )}
        />

        <Controller
          name="quantity"
          control={control}
          rules={{
            required: "Quantity is required",
            min: { value: 0, message: "Quantity must be at least 0" },
            validate: (value) =>
              Number.isInteger(Number(value)) || "Quantity must be an integer",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
          )}
        />

        <Controller
          name="imageFile"
          control={control}
          rules={{ required: "Image is required" }}
          render={({ field }) => (
            <div
              style={
                image
                  ? {
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "2rem",
                    }
                  : null
              }
            >
              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    field.onChange(e.target.files[0]);
                    setImage(e.target.files[0]);
                  }}
                />
              </Button>
              {errors.imageFile && (
                <FormHelperText error>
                  {errors.imageFile.message}
                </FormHelperText>
              )}
              {image && (
                <Box
                  component="img"
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 1,
                    ml: 2,
                  }}
                />
              )}
            </div>
          )}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            onClick={handleSubmit(onFormSubmit)}
          >
            {!loading ? "Update Product" : <CircularProgress size={24} />}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditProductForm;
