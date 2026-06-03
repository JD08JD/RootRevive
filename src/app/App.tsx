import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CategoryProvider } from "./context/CategoryContext";

export default function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <RouterProvider router={router} />
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}
