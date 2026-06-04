import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log(`[AUTH] AuthProvider initialized at ${new Date().toISOString()}`);

  const fetchProfile = async (userId: string) => {
    console.log(`[AUTH] fetchProfile: Requesting profile for UUID: ${userId}`);
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, display_name, is_admin")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(`[AUTH] fetchProfile: Supabase error:`, error.message);
        setProfile(null);
        return null;
      }

      if (data) {
        console.log(`[AUTH] fetchProfile: SUCCESS! Data received:`, data);
        setProfile(data);
        return data;
      }

      console.warn(`[AUTH] fetchProfile: No profile found for this user ID.`);
      setProfile(null);
      return null;
    } catch (err) {
      console.error(`[AUTH] fetchProfile: Error:`, err);
      setProfile(null);
      return null;
    }
  };

  const createProfileIfMissing = async (user: User) => {
    if (!user.id) return;

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        console.log(`[AUTH] createProfileIfMissing: Profile already exists, skipping create`);
        await fetchProfile(user.id);
        return;
      }

      // Profile doesn't exist, create it
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        display_name: user.email?.split("@")[0] ?? null,
        is_admin: false,
      });

      if (error) {
        console.warn("[AUTH] Profile create error:", error);
      } else {
        console.log(`[AUTH] createProfileIfMissing: Profile created successfully`);
        await fetchProfile(user.id);
      }
    } catch (err) {
      console.error("[AUTH] Exception in createProfileIfMissing:", err);
    }
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const restoreSession = async () => {
    try {
      for (let attempt = 1; attempt <= 5; attempt += 1) {
        const { data } = await supabase.auth.getSession();
        const activeSession = data.session;

        if (activeSession?.user) {
          return activeSession.user;
        }

        if (attempt === 1) {
          console.log(`[AUTH] restoreSession: No active session, attempting refreshSession...`);
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.warn(`[AUTH] restoreSession: refreshSession failed:`, refreshError.message);
          } else {
            const refreshedUser = refreshData.session?.user || null;
            if (refreshedUser) {
              console.log(`[AUTH] restoreSession: Refreshed session user:`, refreshedUser.email);
              return refreshedUser;
            }
          }
        }

        if (attempt < 5) {
          console.log(`[AUTH] restoreSession: Session missing, retrying after delay (attempt ${attempt})...`);
          await sleep(400);
        }
      }

      console.log(`[AUTH] restoreSession: No session restored after retries`);
      return null;
    } catch (err) {
      console.error(`[AUTH] restoreSession: Error:`, err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log(`[AUTH] initAuth: Checking session...`);
      try {
        const sessionUser = await restoreSession();

        if (sessionUser) {
          console.log(`[AUTH] initAuth: Session found for user:`, sessionUser.email);
          setUser(sessionUser);
          setIsAuthenticated(true);
          const fetchedProfile = await fetchProfile(sessionUser.id);
          if (!fetchedProfile) {
            await createProfileIfMissing(sessionUser);
          }
        } else {
          console.log(`[AUTH] initAuth: No session found`);
        }
      } catch (err) {
        console.error(`[AUTH] initAuth: Error during auth initialization:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log(`[AUTH] onAuthStateChange: Event=${_event}, Session=${!!session}`);
      
      if (_event === "SIGNED_OUT" || _event === "USER_DELETED") {
        console.log(`[AUTH] User signed out or deleted, clearing state...`);
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        let sessionUser = session?.user || null;

        if (!sessionUser && _event !== "INITIAL_SESSION") {
          console.log(`[AUTH] No session in event, trying restoreSession...`);
          sessionUser = await restoreSession();
        }

        setUser(sessionUser);
        setIsAuthenticated(Boolean(sessionUser));

        if (sessionUser) {
          console.log(`[AUTH] User authenticated:`, sessionUser.email);
          const fetchedProfile = await fetchProfile(sessionUser.id);
          if (!fetchedProfile) {
            await createProfileIfMissing(sessionUser);
          }
        }
      } catch (err) {
        console.error(`[AUTH] Error handling auth state change:`, err);
      } finally {
        setIsLoading(false);
      }
    });

    const handleVisibilityChange = async () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        console.log(`[AUTH] visibilitychange: tab visible, restoring session...`);
        const sessionUser = await restoreSession();
        if (sessionUser) {
          setUser(sessionUser);
          setIsAuthenticated(true);
          await fetchProfile(sessionUser.id);
        }
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      listener.subscription?.unsubscribe();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(`[AUTH] login: Attempting login for email: ${email}`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        console.error(`[AUTH] login: Failed - Error:`, error?.message);
        return false;
      }

      const loggedUser = data.user;
      console.log(`[AUTH] login: Success - User:`, loggedUser.email);
      // Note: user and isAuthenticated will be set by onAuthStateChange
      // Profile will be fetched by onAuthStateChange

      console.log(`[AUTH] login: Login process completed successfully`);
      return true;
    } catch (err) {
      console.error(`[AUTH] login: Exception:`, err);
      return false;
    }
  };

  const logout = async () => {
    console.log(`[AUTH] logout: Starting logout process...`);
    
    // Clear state IMMEDIATELY for UI responsiveness
    // This prevents "stuck loading" if signOut() hangs
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);

    try {
      console.log(`[AUTH] logout: Calling supabase.auth.signOut()...`);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error(`[AUTH] logout: Supabase signOut error:`, error);
      } else {
        console.log(`[AUTH] logout: Supabase signOut successful`);
      }
    } catch (err) {
      console.error(`[AUTH] logout: Exception during Supabase signOut:`, err);
    }
    
    console.log(`[AUTH] logout: Logout process completed`);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      console.log(`[AUTH] refreshProfile: Manually refreshing profile for user:`, user.email);
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
