import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../data/products";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<boolean>;
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const mapProductRow = (row: any): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  description: row.description,
  benefits: row.benefits || [],
  image: row.image_url || row.image || "https://images.unsplash.com/photo-1776188590471-db74f543cf52?w=400",
  featured: row.featured || false,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data.map(mapProductRow));
    } else {
      console.error("Unable to load products", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, "id">) => {
    if (!user) {
      return false;
    }

    const { error } = await supabase.from("products").insert({
      name: productData.name,
      category: productData.category,
      price: productData.price,
      description: productData.description,
      image_url: productData.image,
      benefits: productData.benefits,
      featured: productData.featured,
      created_by: user.id,
    });

    if (error) {
      console.error("Unable to add product", error);
      return false;
    }

    await refreshProducts();
    return true;
  };

  const updateProduct = async (id: string, productData: Omit<Product, "id">) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        description: productData.description,
        image_url: productData.image,
        benefits: productData.benefits,
        featured: productData.featured,
      })
      .eq("id", id);

    if (error) {
      console.error("Unable to update product", error);
      return false;
    }

    await refreshProducts();
    return true;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Unable to delete product", error);
      return false;
    }

    await refreshProducts();
    return true;
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
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
