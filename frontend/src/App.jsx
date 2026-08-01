import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";

import Home from "./pages/customer/Home";
import Cart from "./pages/customer/Cart";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import ProductDetail from "./pages/customer/ProductDetail";
import Favorites from "./pages/customer/Favorites";
import Checkout from "./pages/customer/Checkout";
import Success from "./pages/customer/Success";
import OrderHistory from "./pages/customer/OrderHistory";
import Promotions from "./pages/customer/Promotions";

import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import Reports from "./pages/admin/Reports";
import Supplies from "./pages/admin/Supplies";
import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import StockHistory from "./pages/admin/inventory/components/StockHistory";

import Toast from "./components/common/Toast";
import Menu from "./pages/customer/Menu";
import AIChatbot from "./components/ai/AIChatBot";

import Profile from "./pages/customer/Profile";

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

  const fetchProducts = async () => {

      try {

          const response = await fetch(
              "http://localhost:5000/api/products"
          );


          if(!response.ok){
              throw new Error("Cannot fetch products");
          }


          const data = await response.json();


          setProducts(data);


      } catch(err){

          console.log(err);

      }

  };

  useEffect(() => {

      const loadProducts = async()=>{

          try{

              await fetchProducts();

          }

          catch(err){

              console.log(err);

          }

          finally{

              setLoading(false);

          }

      };


      loadProducts();


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

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

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
                favorites={favorites}
                setFavorites={setFavorites}
                user={user}
                showToast={showToast}
            />
          }
        />

        {/* FAVORITES */}
        <Route
          path="/favorites"
          element={
            <Favorites
              products={products}
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
              setCart={setCart}
              favorites={favorites}
              setFavorites={setFavorites}
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
              setOrders={setOrders}
              cart={cart}
              setCart={setCart}
              showToast={showToast}
              user={user}
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
              orders={orders}
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
                fetchProducts={fetchProducts}
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
              <Supplies/>
            }
          />

          {/* STOCK HISTORY */}
          <Route
              path="stock-history"
              element={
                  <StockHistory />
              }
          />

        </Route>

      </Routes>

      <AIChatbot 
      products={products}
      cart={cart}
      />

      <Toast message={toast} />

    </BrowserRouter>
  );
}