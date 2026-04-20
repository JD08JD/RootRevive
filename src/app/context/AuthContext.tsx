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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log(`[AUTH] AuthProvider initialized at ${new Date().toISOString()}`);

  const fetchProfile = async (userId: string) => {
    console.log(`[AUTH] fetchProfile called for userId: ${userId}`);
    try {
      console.log(`[AUTH] fetchProfile: Starting query...`);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, display_name, is_admin")
        .eq("id", userId)
        .single();

      console.log(`[AUTH] fetchProfile: Query completed, error:`, error);
      console.log(`[AUTH] fetchProfile: Query data:`, data);

      if (error) {
        console.error(`[AUTH] fetchProfile error:`, error);
        setProfile(null);
        return null;
      } else if (data) {
        console.log(`[AUTH] fetchProfile success:`, data);
        setProfile(data);
        return data;
      } else {
        console.warn(`[AUTH] fetchProfile: No profile data found`);
        setProfile(null);
        return null;
      }
    } catch (err) {
      console.error(`[AUTH] fetchProfile exception:`, err);
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

  useEffect(() => {
    const initAuth = async () => {
      console.log(`[AUTH] initAuth: Checking session...`);
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session?.user) {
        console.log(`[AUTH] initAuth: Session found for user:`, session.user.email);
        setUser(session.user);
        setIsAuthenticated(true);
        const fetchedProfile = await fetchProfile(session.user.id);
        if (!fetchedProfile) {
          await createProfileIfMissing(session.user);
        }
      } else {
        console.log(`[AUTH] initAuth: No session found`);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log(`[AUTH] onAuthStateChange: Event=${_event}, Session=${!!session}`);
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      setIsAuthenticated(Boolean(sessionUser));

      if (sessionUser) {
        console.log(`[AUTH] onAuthStateChange: User authenticated:`, sessionUser.email);
        // Always fetch fresh profile data on auth state change
        const fetchedProfile = await fetchProfile(sessionUser.id);
        if (!fetchedProfile) {
          await createProfileIfMissing(sessionUser);
        }
      } else {
        console.log(`[AUTH] onAuthStateChange: User logged out`);
        setProfile(null);
      }
    });

    return () => {
      listener.subscription?.unsubscribe();
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
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      console.log(`[AUTH] refreshProfile: Manually refreshing profile for user:`, user.email);
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated, login, logout, refreshProfile }}>
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
