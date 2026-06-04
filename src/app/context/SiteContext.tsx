import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

interface SiteContextType {
  getPageContent: (pageKey: string) => any;
  updatePageContent: (pageKey: string, content: any) => Promise<boolean>;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("page_content").select("*");
      if (error) throw error;
      
      const contentMap: Record<string, any> = {};
      data?.forEach(item => {
        contentMap[item.page_key] = item.content;
      });
      setContents(contentMap);
    } catch (err) {
      console.error("Error fetching site contents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const getPageContent = (pageKey: string) => {
    return contents[pageKey];
  };

  const updatePageContent = async (pageKey: string, content: any) => {
    console.log(`[SITE] updatePageContent: Starting for ${pageKey}...`);
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out after 15 seconds. This may be due to network issues or an ad-blocker.")), 15000);
      });

      // The actual supabase call
      const upsertPromise = supabase
        .from("page_content")
        .upsert({ 
          page_key: pageKey, 
          content, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'page_key' });

      // Race them
      console.log(`[SITE] updatePageContent: Calling Supabase upsert...`);
      const { data, error } = await Promise.race([upsertPromise, timeoutPromise]) as any;
      console.log(`[SITE] updatePageContent: Received response`);
      
      if (error) {
        console.error(`[SITE] Error updating content for ${pageKey}:`, error);
        return { success: false, error: error.message || error.details };
      }
      
      console.log(`[SITE] Successfully updated content for ${pageKey}`);
      setContents(prev => ({ ...prev, [pageKey]: content }));
      return { success: true };
    } catch (err: any) {
      console.error(`[SITE] Exception updating content for ${pageKey}:`, err);
      return { success: false, error: err.message || "Unknown connection error" };
    }
  };

  return (
    <SiteContext.Provider value={{ getPageContent, updatePageContent, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
