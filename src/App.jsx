import Header from "./components/Header";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import ContactUs from "./pages/contact us/Contactus";
import Products from "./pages/products/Products";
import Categories from "./pages/categories/Categories";
import { useContext } from "react";
import { MainContext } from "./services/context/MainContext";
import Profile from "./pages/profile/Profile";
import Product from "./pages/product page/Product";
import Footer from "./components/Footer";
import CartPage from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import OrdersTable from "./components/Orders";
import SkeletonDashboard from "./components/SkeletonDashboard";
import Dashboard from "./pages/dashboard/Dashboard";
import AddProductForm from "./pages/add product/AddProduct";
import EditProductForm from "./pages/update product/UpdateProduct";

const App = () => {
  const { isAuth, role } = useContext(MainContext);
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:prodcut_id" element={<Product />} />
        <Route path="/gategories" element={<Categories />} />

        {isAuth ? (
          <>
            <Route path="/register" element={<Navigate to={"/"} />} />
            <Route path="/login" element={<Navigate to={"/"} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
          </>
        ) : (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Navigate to={"/register"} />} />
            <Route path="/cart" element={<Navigate to={"/register"} />} />
            <Route path="/checkout" element={<Navigate to={"/register"} />} />
          </>
        )}
        {isAuth && role == "user" ? (
          <Route path="/dashboard" element={<OrdersTable />} />
        ) : isAuth && role == "super" ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProductForm />} />
            <Route
              path="/edit-product/:product_id"
              element={<EditProductForm />}
            />
          </>
        ) : (
          <Route path="/dashboard" element={<SkeletonDashboard />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
