import { supabase } from '@/lib/supabase';
import type { AuthUser, SignupData, LoginData, User, UserProfile } from '@/types';

export class AuthService {
  /**
   * Sign up a new user
   */
  async signup(data: SignupData): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      // Create auth user
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signupError) {
        return { user: null, error: signupError };
      }

      if (!authData.user) {
        return { user: null, error: new Error('Failed to create user') };
      }

      // Create user profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        company: data.company || null,
      });

      if (profileError) {
        return { user: null, error: profileError };
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error : new Error('Unknown error during signup'),
      };
    }
  }

  /**
   * Log in an existing user
   */
  async login(data: LoginData): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginError) {
        return { user: null, error: loginError };
      }

      if (!authData.user) {
        return { user: null, error: new Error('Failed to login') };
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error : new Error('Unknown error during login'),
      };
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Unknown error during logout'),
      };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get the current user's session
   */
  async getSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<{ profile: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { profile: null, error };
      }

      if (!data) {
        return { profile: null, error: new Error('Profile not found') };
      }

      return {
        profile: {
          id: data.id,
          email: data.email,
          name: data.name,
          company: data.company || undefined,
          avatar: data.avatar || undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        profile: null,
        error: error instanceof Error ? error : new Error('Unknown error fetching profile'),
      };
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: UserProfile
  ): Promise<{ profile: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          company: updates.company || null,
          avatar: updates.avatar || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error };
      }

      if (!data) {
        return { profile: null, error: new Error('Failed to update profile') };
      }

      return {
        profile: {
          id: data.id,
          email: data.email,
          name: data.name,
          company: data.company || undefined,
          avatar: data.avatar || undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        profile: null,
        error: error instanceof Error ? error : new Error('Unknown error updating profile'),
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
        });
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
