# Main Features & Properties of Your Website

1. ## Authentication & User Management

   User Authentication State: Tracks if a user is authenticated (isAuth), current user info (user), and user role (role).
   Login & Registration: Functions to register (register) and log in (logIn) users, with validation and error handling.
   Logout: Function to log out users (logout).
   User Role Management: Fetches user roles, updates user roles (updateUser Role), updates user names (updateUser Name), deletes users (deleteUser ), and fetches all users (getUsers).
   Password & Email Validation: Validates password strength (validatePassword), email format (validateEmail), and username format (validateUser Name).

2. ## Product & Category Management

   Products State: Manages product list (products), loading and error states.
   Fetch Products: Fetches all products (fetchProducts), latest products (fetchLatestProducts), and single product details (fetchProduct).
   Create, Update, Delete Products: Functions to create (createProduct), update (updateProduct), and delete (deleteProduct) products.
   Search Products: Search functionality (searchProducts).
   Categories: Fetches categories (fetchGategories), add (addCategory), update (updateGategory), and remove categories (removeGategory).

3. ## Shopping Cart

   Cart Items: Manages cart items (items).
   Fetch Cart: Fetches current cart items (fetchCart).
   Add, Remove, Update Cart Items: Functions to add to cart (addToCart), remove from cart (removeFromCart), and update item quantity (updateItemQuantity).

4. ## Orders

   Orders State: Manages all orders (allOrders) and current user’s orders (userOrders).
   Fetch Orders: Fetches all orders (getOrders) and current user’s orders (fetchCurrentUser Order).
   Cancel Order: Cancels an order (cancelOrder).

5. ## Payment Integration (Stripe)

   Payment Intent: Creates payment intent (createPaymentIntent) and stores client secret and order ID.
   Submit Payment: Confirms payment intent with Stripe API (handleSubmitPayment).

6. ## Error Handling & Loading States

   Tracks errors for registration (registerError), login (loginError), and password validation (passwordErrors).
   Loading states for product fetching and other async operations.

7. ## Utilities

   Uses Axios with CSRF protection and credentials for secure API calls.
   Navigation control with React Router’s useNavigate.
   Context provider exposes all these states and functions to the app.

### Summary

This website is a full-featured e-commerce platform with:

    User authentication and role-based access.
    Product and category management.
    Shopping cart and order management.
    Stripe payment integration.
    Robust validation and error handling.
    Centralized state management via React Context.
