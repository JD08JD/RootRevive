import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPageNew from "./pages/AdminPageNew";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "products", Component: ProductsPage },
      { path: "products/:id", Component: ProductDetailPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { 
        path: "admin", 
        element: (
          <ProtectedRoute>
            <AdminPageNew />
          </ProtectedRoute>
        )
      },
    ],
  },
]);
