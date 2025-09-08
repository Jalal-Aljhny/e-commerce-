import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
axios.defaults.baseURL = "https://localhost:8000";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const apiStripe = axios.create({
  baseURL: "https://api.stripe.com/v1",
});

// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
// };

// function deleteCookie(name) {
//   document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// }

// eslint-disable-next-line react-refresh/only-export-components
export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [items, setItems] = useState([]);
  const [productData, setProductData] = useState(null);
  const clearRegisterError = () => {
    setRegisterError(null);
  };
  const [loginError, setLoginError] = useState(null);
  const clearLoginError = () => {
    setLoginError(null);
  };
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.get("/api/user", { withCredentials: true });
      console.log(" check Auth func :", response);

      setUser(response.data.data);
      setIsAuth(true);

      if (sessionStorage.getItem("pre_page")) {
        navigate(sessionStorage.getItem("pre_page"));
        sessionStorage.clear();
      }
    } catch {
      console.log("not logged in");
      setIsAuth(false);
      setUser(null);
    }
  }, [navigate]);

  const checkUser = useCallback(async (userId) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.get(`/api/users/${userId}`, {
        withCredentials: true,
      });
      console.log(" check user func :", response);
      console.log("role : ", response.data.user.role);
      if (response.data.user.role.includes("Super Admin")) {
        setRole("super");
      } else {
        setRole("user");
      }
    } catch (error) {
      console.log(error);
      console.log("failed to get user role");
      setRole(null);
    }
  }, []);
  const [users, setUsers] = useState([]);
  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get("/api/users", {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });
      console.log("users : ", response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
      console.log("failed to get users ");
    }
  }, []);

  const getUser = useCallback(async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.log(error);
      console.log("failed to get user ");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?.id) {
      checkUser(user.id);
    }
  }, [user, checkUser]);

  const updateUserName = async (userId, newName) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.patch(
        `/api/users/${userId}`,
        { name: newName },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      // setUsers(response.data.users);
      // console.log("users : ", response.data.users);
      await getUsers();
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.patch(
        `/api/users/update-role/${userId}`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      await getUsers();
      console.log("users : ", response.data);
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`/api/users/${id}`, {
        headers: { Accept: "application/json" },
        withCredentials: true,
      });
      await getUsers();
      console.log(response.data.message);
    } catch (error) {
      console.error("Error deleting product:", error.response?.data);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/(?=.*[0-9])/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/(?=.*[^A-Za-z0-9])/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    if (password.length < 8) {
      errors.push("Password must be at least eight characters long.");
    }
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return errors;
    } else {
      return true;
    }
  };

  const validateEmail = (email) => {
    const cleanEmail = email.trim();
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(cleanEmail);
  };

  const validateUserName = useCallback((username) => {
    const re = /^[a-zA-Z]/;
    return re.test(username);
  }, []);

  const register = useCallback(
    async (name, email, password, password2, rememberMe) => {
      try {
        await axios.get("/sanctum/csrf-cookie");
        // Prepare form data
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", password2);
        formData.append("remember", rememberMe);

        await axios.post("/register", formData, {
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        });
        setIsAuth(true);
        if (sessionStorage.getItem("pre_page")) {
          navigate(`${sessionStorage.getItem("pre_page")}`);
        } else {
          navigate("/");
        }
      } catch (error) {
        console;
        const err = error.response
          ? error.response.data.message
          : error.message;
        console.log(" Register error : ", err);
        setRegisterError(err); // to display on register page
        setIsAuth(false);
      }
    },
    [navigate]
  );
  const logIn = useCallback(
    async (email, password, rememberMe) => {
      // Prepare the request body
      const requestBody = new FormData();
      requestBody.append("email", email);
      requestBody.append("password", password);
      requestBody.append("remember", rememberMe);

      try {
        await axios.get("/sanctum/csrf-cookie");
        await axios.post("/login", requestBody, {
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        });

        setIsAuth(true);
        if (sessionStorage.getItem("pre_page")) {
          navigate(`${sessionStorage.getItem("pre_page")}`);
        } else {
          navigate("/");
        }
      } catch (error) {
        setIsAuth(false);
        const err = error.response
          ? error.response.data.message
          : error.message;
        setLoginError(err);
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post(
        "/logout",
        {},
        {
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      );

      console.log("logout response:", response);
      setIsAuth(false);
      navigate("/");
    } catch (error) {
      console.error("logout error:", error);
      setIsAuth(false);
    }
  }, [navigate]);

  function productsReducer(state, action) {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          loading: true,
          error: null,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          loading: false,
          products: action.payload,
          error: null,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  }
  const initialDataProducts = {
    products: [],
    loading: false,
    error: null,
  };
  const [state, dispatch] = useReducer(productsReducer, initialDataProducts);

  const fetchProducts = async (page = 1) => {
    dispatch({ type: "FETCH_INIT" });
    try {
      const response = await axios.get(`/api/products?page=${page}`, {
        withCredentials: true,
        headers: { Accept: "application/json" },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: response.data.products });
      console.log(response.data.products);
    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        payload: error.message || "Error fetching products",
      });
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      const response = await axios.get("/api/products/latest-products", {
        withCredentials: true,
        headers: { Accept: "application/json" },
      });
      console.log(response.data.products);
    } catch (error) {
      console.error("Error fetching latest products:", error);
    }
  };
  const fetchProduct = useCallback(async (id) => {
    try {
      if (id) {
        const response = await axios.get(`/api/products/${id}`, {
          withCredentials: true,
          headers: { Accept: "application/json" },
        });
        setProductData(response.data.product);
      }
      // console.log(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, []);

  const createProduct = async (
    title,
    description,
    quantity,
    price,
    category,
    image
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category_name[]", category);
      formData.append("quantity", quantity);
      if (image) {
        formData.append("image", image);
      }
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      // console.log(response.data.message);
      await fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const updateProduct = async (
    id,
    title,
    description,
    quantity,
    price,
    category,
    image
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category_name[]", category);
      formData.append("quantity", quantity);
      formData.append("_method", "patch");
      if (image) {
        formData.append("image", image);
      }
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(`/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      await fetchProducts();

      // Optionally refresh product list or navigate
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`/api/products/${id}`, {
        headers: { Accept: "application/json" },
        withCredentials: true,
      });
      console.log(response.data.message);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error.response?.data);
    }
  };
  // TODO
  const searchProducts = async (searchTerm) => {
    try {
      const response = await axios.get(
        `/api/products/search?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: { Accept: "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data.products);
    } catch (error) {
      if (error.response?.status === 422) {
        alert(error.response.data.message);
      } else {
        console.error("Error searching products:", error);
      }
    }
  };

  const fetchGategories = async () => {
    try {
      const response = await axios.get("/api/categories", {
        withCredentials: true,
        headers: { Accept: "application/json" },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching latest categories:", error);
    }
  };

  const addCategory = async (category) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(
        "/api/categories",
        {
          category_name: category,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      await fetchGategories();
      // setError(null);
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data.message);
      } else {
        console.log("Failed to add item");
      }
    }
  };

  const updateGategory = async (category_id, category_name) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.patch(
        `/api/categories/${category_id}`,
        { category_name },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      await fetchGategories();
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  const removeGategory = async (category_id) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.delete(`/api/categories/${category_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: true,
      });
      await fetchGategories();
    } catch {
      console.log("Failed to remove item");
    }
  };
  useEffect(() => {
    fetchGategories();
  }, []);
  // orders
  const [allOrders, setAllOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const fetchCurrentUserOrder = useCallback(async () => {
    try {
      const response = await axios.get("/api/orders/my-orders", {
        withCredentials: true,
        headers: { Accept: "application/json" },
      });
      setUserOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching current user orders:", error);
    }
  }, []);
  const getOrders = useCallback(async () => {
    try {
      const response = await axios.get("/api/orders");
      setAllOrders(response.data.orders);
    } catch (err) {
      console.log("Failed to load orders", err);
    }
  }, []);
  const cancelOrder = useCallback(
    async (id) => {
      try {
        await axios.get("/sanctum/csrf-cookie");
        await axios.patch(`/api/orders/${id}`);
        await getOrders();
      } catch (err) {
        console.log("Failed to load orders", err);
      }
    },
    [getOrders]
  );

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get("/api/cart");
      setItems(response.data.items);
      console.log(response.data.items);
    } catch (err) {
      console.log("Failed to load cart");
      console.log(err);
    }
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post(
        "/api/cart/add",
        {
          product_id: productId,
          quantity,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      setItems(response.data.items);
      console.log(response.data.items);
      // setError(null);
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data.message);
      } else {
        console.log("Failed to add item");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.delete(`/api/cart/${itemId}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: true,
      });
      setItems(response.data.items);
      console.log(response.data.items);
    } catch {
      console.log("Failed to remove item");
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.patch(
        `/api/cart/${itemId}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      setItems(response.data.items);
      console.log("update quantity function:", response.data.items);
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const createPaymentIntent = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post(
        "/api/checkout/create-payment-intent",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      setClientSecret(response.data.clientSecret);
      setOrderId(response.data.orderId);
    } catch (err) {
      console.log(
        err.response?.data?.message || "Failed to create payment intent"
      );
    }
  };
  // console.log("clientSecret : ", clientSecret?.split("_secret_")[0]);
  // console.log("orderId : ", orderId);
  const handleSubmitPayment = async () => {
    await axios.get("/sanctum/csrf-cookie");
    const response = await apiStripe.post(
      `/payment_intents/${clientSecret?.split("_secret_")[0]}/confirm`
    );
    return response;
  };

  console.log("isAuth:", isAuth);
  return (
    <MainContext.Provider
      value={{
        validatePassword,
        passwordErrors,
        validateEmail,
        validateUserName,
        register,
        isAuth,
        logIn,
        logout,
        registerError,
        clearRegisterError,
        loginError,
        clearLoginError,
        ...state,
        fetchProducts,
        categories,
        addToCart,
        fetchCart,
        removeFromCart,
        updateItemQuantity,
        items,
        fetchProduct,
        productData,
        clientSecret,
        orderId,
        createPaymentIntent,
        role,
        getUsers,
        users,
        user,
        updateUserName,
        updateUserRole,
        deleteUser,
        getUser,
        createProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateGategory,
        removeGategory,
        cancelOrder,
        allOrders,
        userOrders,
        fetchCurrentUserOrder,
        getOrders,
        handleSubmitPayment,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
