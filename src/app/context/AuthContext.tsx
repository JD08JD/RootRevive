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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from<Profile>("profiles")
      .select("id, email, display_name, is_admin")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    } else {
      setProfile(null);
    }
  };

  const createProfileIfMissing = async (user: User) => {
    if (!user.id) return;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        display_name: user.email?.split("@")[0] ?? null,
        is_admin: false,
      },
      { onConflict: "id" }
    );

    if (!error) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        await fetchProfile(session.user.id);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      setIsAuthenticated(Boolean(sessionUser));

      if (sessionUser) {
        await fetchProfile(sessionUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return false;
    }

    const loggedUser = data.user;
    setUser(loggedUser);
    setIsAuthenticated(true);
    await createProfileIfMissing(loggedUser);

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated, login, logout }}>
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
