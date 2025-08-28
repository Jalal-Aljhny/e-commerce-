import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

// Function to get a specific cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

// eslint-disable-next-line react-refresh/only-export-components
export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isAuth, setIsAuth] = useState(false);

  const fetchCsrfToken = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      console.log("CSRF cookie fetched successfully.");
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
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

  const register = useCallback(async (name, email, password, password2) => {
    // Prepare the request body
    await fetchCsrfToken();
    const requestBody = new FormData();
    requestBody.append("name", name);
    requestBody.append("email", email);
    requestBody.append("password", password);
    requestBody.append("password_confirmation", password2);

    const xsrfToken = getCookie("XSRF-TOKEN"); // Get the CSRF token from cookies

    try {
      const response = await axios.post("/register", requestBody, {
        headers: {
          "X-XSRF-TOKEN": xsrfToken, // Use the CSRF token directly
          Accept: "application/json",
        },
      });
      console.log("Registration response:", response);
      setIsAuth(true);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response ? error.response.data : error.message
      );
      setIsAuth(false);
    }
    console.log("document.cookie : ", document.cookie);
  }, []);

  const logIn = useCallback(async (email, password) => {
    // Prepare the request body
    const requestBody = new FormData();
    requestBody.append("email", email);
    requestBody.append("password", password);

    const xsrfToken = getCookie("XSRF-TOKEN"); // Get the CSRF token from cookies

    try {
      const response = await axios.post("/login", requestBody, {
        headers: {
          "X-XSRF-TOKEN": xsrfToken, // Use the CSRF token directly
        },
      });
      console.log("Login response:", response);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
    }
  }, []);

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
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
