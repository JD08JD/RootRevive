import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, products as initialProducts } from "../data/products";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Try to load products from localStorage
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    return initialProducts;
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(), // Simple ID generation
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Omit<Product, "id">) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...productData, id } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
