import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import OrderHistory from "./pages/OrderHistory";
import Promotions from "./pages/Promotions";

import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import Reports from "./pages/admin/Reports";
import Supplies from "./pages/admin/Supplies";
import Payments from "./pages/admin/Payments";
import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";

import Toast from "./components/Toast";
import Menu from "./pages/Menu";
import AIChatbot from "./components/AIChatBot";

import Profile from "./pages/Profile";

export default function App() {

  /* =========================
     STATES
  ========================= */

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [orders, setOrders] =
    useState([]);

  const [cart, setCart] = useState(
    JSON.parse(
      localStorage.getItem("cart")
    ) || []
  );

  const [favorites, setFavorites] =
    useState(
      JSON.parse(
        localStorage.getItem("favorites")
      ) || []
    );

  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user")
    ) || null
  );

  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin"))
    || null
  );

  const [toast, setToast] =
    useState("");


  /* =========================
     TOAST
  ========================= */

  const showToast = (msg) => {

    setToast(msg);

    setTimeout(() => {
      setToast("");
    }, 2000);

  };


  /* =========================
     FETCH PRODUCTS
  ========================= */

  useEffect(() => {

    fetch(
      "http://localhost:5000/api/products"
    )
      .then((res) => res.json())

      .then((data) => {

        setProducts(data);

        setLoading(false);

      })

      .catch((err) => {

        console.log(err);

        setLoading(false);

      });

  }, []);


  /* =========================
     FETCH ORDERS
  ========================= */

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/orders"
        );

      const data =
        await response.json();

      setOrders(data);

    } catch (err) {

      console.log(err);

    }

  };


  /* =========================
     LOCAL STORAGE
  ========================= */

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);


  useEffect(() => {

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

  }, [favorites]);


  useEffect(() => {

    if (user) {

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

    } else {

      localStorage.removeItem("user");

    }

  }, [user]);

  useEffect(() => {

    if (admin) {

      localStorage.setItem(
        "admin",
        JSON.stringify(admin)
      );

    } else {

      localStorage.removeItem("admin");

    }

  }, [admin]);


  /* =========================
     LOADING SCREEN
  ========================= */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading products...
      </div>
    );

  }


  /* =========================
     APP
  ========================= */

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <Home
              products={products}
              cart={cart}
              setCart={setCart}
              user={user}
              setUser={setUser}
              favorites={favorites}
              setFavorites={setFavorites}
              showToast={showToast}
            />
          }
        />

        {/* MENU */}
        <Route
          path="/menu"
          element={
            <Menu
              products={products}
              cart={cart}
              setCart={setCart}
              favorites={favorites}
              setFavorites={setFavorites}
              user={user}
              setUser={setUser}
              showToast={showToast}
            />
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
            />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* PRODUCT DETAIL */}
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              products={products}
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* FAVORITES */}
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              cart={cart}
              setCart={setCart}
              user={user}
              setUser={setUser}
              setFavorites={setFavorites}
            />
          }
        />

        {/* PROMOTIONS */}
        <Route
          path="/promotions"
          element={
            <Promotions
              products={products}
              cart={cart}
              user={user}
              setUser={setUser}
              showToast={showToast}
            />
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
              orders={orders}
              setOrders={setOrders}
              user={user}
            />
          }
        />

        {/* SUCCESS */}
        <Route
          path="/success"
          element={<Success />}
        />

        {/* ORDER HISTORY */}
        <Route
          path="/orders"
          element={
            <OrderHistory
              orders={orders}
              cart={cart}
              setCart={setCart}
              showToast={showToast}
            />
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              setUser={setUser}
              cart={cart}
            />
          }
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={
            <AdminLogin
              setAdmin={setAdmin}
              showToast={showToast}
            />
          }
        />

        {/* ADMIN ROOT */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute admin={admin}>
              <AdminDashboard
                orders={orders}
              />
            </AdminProtectedRoute>
          }
        >

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={
              <AdminHome
                orders={orders}
              />
            }
          />

          {/* DEFAULT ADMIN */}
          <Route
            index
            element={
              <AdminHome
                orders={orders}
              />
            }
          />

          {/* MENU */}
          <Route
            path="menu"
            element={
              <MenuManagement
                products={products}
                setProducts={setProducts}
              />
            }
          />

          {/* ORDERS */}
          <Route
            path="orders"
            element={
              <OrderManagement
                orders={orders}
                setOrders={setOrders}
              />
            }
          />

          {/* REPORTS */}
          <Route
            path="reports"
            element={
              <Reports
                orders={orders}
              />
            }
          />

          {/* SUPPLIES */}
          <Route
            path="supplies"
            element={
              <Supplies
                products={products}
                setProducts={setProducts}
              />
            }
          />

          {/* PAYMENTS */}
          <Route
            path="payments"
            element={
              <Payments
                orders={orders}
                setOrders={setOrders}
              />
            }
          />

        </Route>

      </Routes>

      <AIChatbot products={products} />

      <Toast message={toast} />

    </BrowserRouter>
  );
}