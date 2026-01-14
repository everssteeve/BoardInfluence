import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/auth/authService';
import type { AuthUser, User, SignupData, LoginData, UserProfile } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  profile: User | null;
  loading: boolean;
  signup: (data: SignupData) => Promise<{ error: Error | null }>;
  login: (data: LoginData) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: UserProfile) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    const { profile, error } = await authService.getUserProfile(userId);
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    setProfile(profile);
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await fetchProfile(currentUser.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        await fetchProfile(authUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signup = async (data: SignupData) => {
    const { user: newUser, error } = await authService.signup(data);
    if (error) {
      return { error };
    }
    if (newUser) {
      setUser(newUser);
      await fetchProfile(newUser.id);
    }
    return { error: null };
  };

  const login = async (data: LoginData) => {
    const { user: authUser, error } = await authService.login(data);
    if (error) {
      return { error };
    }
    if (authUser) {
      setUser(authUser);
      await fetchProfile(authUser.id);
    }
    return { error: null };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: UserProfile) => {
    if (!user) {
      return { error: new Error('Aucun utilisateur connecté') };
    }

    const { profile: updatedProfile, error } = await authService.updateUserProfile(
      user.id,
      updates
    );

    if (error) {
      return { error };
    }

    setProfile(updatedProfile);
    return { error: null };
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
