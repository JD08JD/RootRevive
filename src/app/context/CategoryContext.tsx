import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  color: string;
  icon: string;
  display_order: number;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, "id" | "created_at">) => Promise<boolean>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error.message);
      } else if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Exception fetching categories:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const addCategory = async (categoryData: Omit<Category, "id">) => {
    try {
      const { error } = await supabase.from("categories").insert(categoryData);
      if (error) throw error;
      await refreshCategories();
      return true;
    } catch (err) {
      console.error("Error adding category:", err);
      return false;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const { error } = await supabase.from("categories").update(categoryData).eq("id", id);
      if (error) throw error;
      await refreshCategories();
      return true;
    } catch (err) {
      console.error("Error updating category:", err);
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      await refreshCategories();
      return true;
    } catch (err) {
      console.error("Error deleting category:", err);
      return false;
    }
  };

  return (
    <CategoryContext.Provider value={{ 
      categories, 
      loading, 
      addCategory, 
      updateCategory, 
      deleteCategory,
      refreshCategories 
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
