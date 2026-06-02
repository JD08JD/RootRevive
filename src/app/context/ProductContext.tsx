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

  console.log(`[PRODUCT] ProductProvider initialized at ${new Date().toISOString()}`);

  const refreshProducts = async () => {
    console.log(`[PRODUCT] refreshProducts: Starting...`);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(`[PRODUCT] refreshProducts: Supabase error:`, error.message);
      } else if (data) {
        console.log(`[PRODUCT] refreshProducts: Success - Loaded ${data.length} products`);
        setProducts(data.map(mapProductRow));
      } else {
        console.warn(`[PRODUCT] refreshProducts: No data returned`);
      }
    } catch (err) {
      console.error(`[PRODUCT] refreshProducts: Error:`, err);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, "id">) => {
    console.log(`[PRODUCT] addProduct: Called with data:`, productData);
    console.log(`[PRODUCT] addProduct: Current user:`, user);

    if (!user) {
      console.error(`[PRODUCT] addProduct: No user authenticated - cannot add product`);
      return false;
    }

    // Check session
    const { data: sessionData } = await supabase.auth.getSession();
    console.log(`[PRODUCT] addProduct: Current session:`, sessionData.session ? 'Valid' : 'None');

    if (!sessionData.session) {
      console.error(`[PRODUCT] addProduct: No valid session - refreshing...`);
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error(`[PRODUCT] addProduct: Session refresh failed:`, refreshError);
        return false;
      }
      console.log(`[PRODUCT] addProduct: Session refreshed`);
    }

    try {
      console.log(`[PRODUCT] addProduct: About to call supabase.from("products").insert()`);
      console.log(`[PRODUCT] addProduct: Insert data:`, {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        description: productData.description,
        image_url: productData.image,
        benefits: productData.benefits,
        featured: productData.featured,
        created_by: user.id,
      });

      const insertPromise = supabase.from("products").insert({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        description: productData.description,
        image_url: productData.image,
        benefits: productData.benefits,
        featured: productData.featured,
        // created_by: user.id, // Temporarily removed for testing
      });

      // Add timeout to detect hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Supabase insert timeout after 30 seconds')), 30000);
      });

      const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any;
      console.log(`[PRODUCT] addProduct: Promise resolved`);

      console.log(`[PRODUCT] addProduct: Supabase response - data:`, data);
      console.log(`[PRODUCT] addProduct: Supabase response - error:`, error);

      if (error) {
        console.error(`[PRODUCT] addProduct: Supabase insert error:`, error);
        console.error(`[PRODUCT] addProduct: Error details:`, {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return false;
      }

      console.log(`[PRODUCT] addProduct: Insert successful, refreshing products...`);
      await refreshProducts();
      console.log(`[PRODUCT] addProduct: Complete success`);
      return true;
    } catch (err) {
      console.error(`[PRODUCT] addProduct: Exception:`, err);
      console.error(`[PRODUCT] addProduct: Exception type:`, typeof err);
      console.error(`[PRODUCT] addProduct: Exception stack:`, err instanceof Error ? err.stack : 'No stack');
      return false;
    }
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
