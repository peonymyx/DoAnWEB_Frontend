import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layoutmain from "./components/Layoutmain.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUp from "./pages/SignUp.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import SignIn from "./pages/SignIn.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AccountManagement from "./components/Admin/pageAdmin/AccountManagement.jsx";
import Product from "./components/Admin/pageAdmin/Product.jsx";
import Addproduct from "./components/Admin/cruds/AddProduct.jsx";
import EditProduct from "./components/Admin/cruds/EditProduct.jsx";
import UpdateMain from "./components/Admin/pageAdmin/UpdateMain.jsx";
import AddCategory from "./components/Admin/cruds/addCategory.jsx";
import ProductsDetail from "./pages/ProductsDetail.jsx";
import PayProducts from "./pages/PayProduct.jsx";
import Cart from "./pages/Cart.jsx";
import Message from "./components/Admin/pageAdmin/Message.jsx";
import OtherManagement from "./components/Admin/pageAdmin/OtherManagement.jsx";
import CommentManagement from "./components/Admin/pageAdmin/CommentManagement.jsx";
import OtherDetails from "./components/Admin/pageAdmin/OtherDetails.jsx";
import OtherSuccess from "./pages/OtherSuccess.jsx";
import Dashboard from "./components/Admin/pageAdmin/Dashboard.jsx";
import LayoutAdmin from "./components/LayoutAdmin.jsx";
import CategoryMain from "./components/Admin/pageAdmin/CategoryMain.jsx";
import ListProducts from "./pages/ListProducts.jsx";
import MyOrder from "./pages/MyOrder.jsx";
import MyOrderDetail from "./pages/MyOrderDetail.jsx";
import Favatie from "./pages/favatie.jsx";
import CouponAdmin from "./components/Admin/pageAdmin/Coupon.jsx";
const router = createBrowserRouter([
  {
    element: <Layoutmain></Layoutmain>,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>,
      },
      {
        path: "/fava",
        element: <Favatie></Favatie>,
      },
      {
        path: "/othersuccess",
        element: <OtherSuccess></OtherSuccess>,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword></ForgotPassword>,
      },
      {
        path: "/reset-password",
        element: <ResetPassword></ResetPassword>,
      },
      {
        path: "/cart",
        element: <Cart></Cart>,
      },
      {
        path: "/payproducts",
        element: <PayProducts></PayProducts>,
      },
      {
        path: "/productdetail/:id",
        element: <ProductsDetail></ProductsDetail>,
      },
      {
        path: "/UpdateMain/:id",
        element: <UpdateMain></UpdateMain>,
      },
      {
        path: "/listProducts",
        element: <ListProducts></ListProducts>,
      },
      {
        path: "/my-order",
        element: <MyOrder />,
      },
      {
        path: "/my-order-detail/:id",
        element: <MyOrderDetail />,
      },
    ],
  },
  {
    element: <LayoutAdmin></LayoutAdmin>,
    children: [
      {
        path: "/admin",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/dashBoard",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/ProductManagement",
        element: <Product></Product>,
      },
      {
        path: "/Addproduct",
        element: <Addproduct></Addproduct>,
      },
      {
        path: "/Editproduct/:id",
        element: <EditProduct></EditProduct>,
      },
      {
        path: "/CouponManage",
        element: <CouponAdmin></CouponAdmin>,
      },
      {
        path: "/AccountManagement",
        element: <AccountManagement></AccountManagement>,
      },

      {
        path: "/addCategory",
        element: <AddCategory></AddCategory>,
      },
      {
        path: "/category",
        element: <CategoryMain></CategoryMain>,
      },

      {
        path: "/mess",
        element: <Message></Message>,
      },
      {
        path: "/otherManagement",
        element: <OtherManagement></OtherManagement>,
      },
      {
        path: "/commentManagement",
        element: <CommentManagement></CommentManagement>,
      },
      {
        path: "/otherdetails/:id",
        element: <OtherDetails></OtherDetails>,
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn></SignIn>,
  },
  {
    path: "/register",
    element: <SignUp></SignUp>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
