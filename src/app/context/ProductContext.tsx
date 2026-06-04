import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../data/products";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

interface ProductContextType {
  products: Product[];
  customAutocompleteNames: string[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  addCustomAutocompleteName: (name: string) => Promise<boolean>;
  deleteCustomAutocompleteName: (name: string) => Promise<boolean>;
  refreshCustomAutocompleteNames: () => Promise<void>;
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
  featured: !!row.featured,
  storage_instructions: row.storage_instructions,
  nutritional_info: row.nutritional_info,
  sourcing_info: row.sourcing_info,
});

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customAutocompleteNames, setCustomAutocompleteNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  console.log(`[PRODUCT] ProductProvider initialized at ${new Date().toISOString()}`);

  const refreshCustomAutocompleteNames = async () => {
    try {
      const { data, error } = await supabase.from("custom_autocomplete").select("name").order("name");
      if (error) throw error;
      if (data) setCustomAutocompleteNames(data.map(d => d.name));
    } catch (err) {
      console.error("Error fetching custom autocomplete names:", err);
    }
  };

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
    refreshCustomAutocompleteNames();
  }, []);

  const addCustomAutocompleteName = async (name: string) => {
    console.log(`[QUICK-NAME] addCustomAutocompleteName: Adding "${name}"`);
    try {
      const { data, error } = await supabase.from("custom_autocomplete").insert({ name });
      
      if (error) {
        if (error.code === '23505') { // Postgres error for unique violation
          console.warn("[QUICK-NAME] Name already exists");
          alert(`"${name}" is already in the list.`);
          return false;
        }
        console.error("[QUICK-NAME] Error details:", error);
        throw error;
      }
      
      console.log("[QUICK-NAME] Successfully added name, refreshing list...");
      await refreshCustomAutocompleteNames();
      return true;
    } catch (err) {
      console.error("[QUICK-NAME] Exception adding name:", err);
      return false;
    }
  };

  const deleteCustomAutocompleteName = async (name: string) => {
    try {
      const { error } = await supabase.from("custom_autocomplete").delete().eq("name", name);
      if (error) throw error;
      await refreshCustomAutocompleteNames();
      return true;
    } catch (err) {
      console.error("Error deleting custom autocomplete name:", err);
      return false;
    }
  };

  const addProduct = async (productData: Omit<Product, "id">) => {
    console.log(`[PRODUCT] addProduct: Called with data:`, productData);
    console.log(`[PRODUCT] addProduct: Current user:`, user);

    if (!user) {
      return { success: false, error: "No user authenticated" };
    }

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Supabase insert timeout after 15 seconds. Check network or ad-blockers.')), 15000);
      });

      const insertPromise = supabase.from("products").insert({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        description: productData.description,
        image_url: productData.image,
        benefits: productData.benefits,
        featured: !!productData.featured,
        storage_instructions: productData.storage_instructions,
        nutritional_info: productData.nutritional_info,
        sourcing_info: productData.sourcing_info,
      });

      const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;

      if (error) {
        console.error(`[PRODUCT] addProduct error:`, error);
        console.log(`[PRODUCT] addProduct error code: ${error.code}, message: ${error.message}`);
        return { success: false, error: `${error.message} (${error.code})` };
      }

      await refreshProducts();
      return { success: true };
    } catch (err: any) {
      console.error(`[PRODUCT] addProduct: Exception:`, err);
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, "id">) => {
    console.log(`[PRODUCT] updateProduct: Updating ID ${id}...`);
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Update timed out after 15 seconds')), 15000);
      });

      const updatePromise = supabase
        .from("products")
        .update({
          name: productData.name,
          category: productData.category,
          price: productData.price,
          description: productData.description,
          image_url: productData.image,
          benefits: productData.benefits,
          featured: !!productData.featured,
          storage_instructions: productData.storage_instructions,
          nutritional_info: productData.nutritional_info,
          sourcing_info: productData.sourcing_info,
        })
        .eq("id", id);

      const { error } = await Promise.race([updatePromise, timeoutPromise]) as any;

      if (error) {
        console.error("[PRODUCT] updateProduct error:", error);
        console.log(`[PRODUCT] updateProduct error code: ${error.code}, message: ${error.message}`);
        return { success: false, error: `${error.message} (${error.code})` };
      }

      await refreshProducts();
      return { success: true };
    } catch (err: any) {
      console.error("[PRODUCT] updateProduct exception:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id: string) => {
    console.log(`[PRODUCT] deleteProduct: Deleting ID ${id}...`);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("[PRODUCT] deleteProduct error:", error);
        return { success: false, error: error.message };
      }

      await refreshProducts();
      return { success: true };
    } catch (err: any) {
      console.error("[PRODUCT] deleteProduct exception:", err);
      return { success: false, error: err.message };
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      customAutocompleteNames, 
      loading, 
      addProduct, 
      updateProduct, 
      deleteProduct,
      addCustomAutocompleteName,
      deleteCustomAutocompleteName,
      refreshCustomAutocompleteNames
    }}>
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
