import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CategoryProvider } from "./context/CategoryContext";
import { SiteProvider } from "./context/SiteContext";

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <CategoryProvider>
          <ProductProvider>
            <RouterProvider router={router} />
          </ProductProvider>
        </CategoryProvider>
      </SiteProvider>
    </AuthProvider>
  );
}
