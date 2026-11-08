import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signInWithGitHub: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'codesphere_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const csUser = localStorage.getItem('codesphere_user');
      if (csUser) {
        const parsed = JSON.parse(csUser);
        return {
          id: parsed._id || parsed.id || 'usr_cs',
          email: parsed.email || 'developer@codesphere.io',
          fullName: parsed.fullName || parsed.name || 'CodeSphere Developer',
          avatarUrl: parsed.avatar || '',
        };
      }
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Default to guest / simulated developer if not yet configured
      if (!user) {
        const guestUser: UserProfile = {
          id: 'usr_guest_demo',
          email: 'developer@codesphere.io',
          fullName: 'CodeSphere Developer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        };
        setUser(guestUser);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
      }
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        setUser(profile);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      const demoUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        fullName: email.split('@')[0],
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      const demoUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        fullName,
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error ? error.message : null };
  };

  const signInWithGitHub = async (): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      const gitHubUser: UserProfile = {
        id: 'usr_github_demo',
        email: 'github.user@codesphere.io',
        fullName: 'GitHub Developer',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      };
      setUser(gitHubUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(gitHubUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    });
    return { error: error ? error.message : null };
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGitHub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from './useAuth';
