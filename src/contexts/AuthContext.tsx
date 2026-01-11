import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getConfirmationRedirectUrl, getPasswordResetRedirectUrl } from '@/utils/supabaseConfig';
import { User, Session } from '@supabase/supabase-js';
import { getFriendlyErrorMessage, FriendlyError } from '@/utils/errorHandler';

// Deployment version - change this value with each deployment
const DEPLOYMENT_VERSION = '2026-01-11-v5';

export type UserRole = 'client' | 'admin' | 'agent' | null;

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  company_id?: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: FriendlyError; role?: UserRole }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: FriendlyError; data?: User; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: FriendlyError }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ success: boolean; error?: FriendlyError }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Handle RLS recursion error specifically
        if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
          console.warn('RLS recursion detected, trying admin bypass...');
          
          // Try using service role or admin context if available
          try {
            const { data: adminData, error: adminError } = await (supabase as any)
              .rpc('get_user_profile_admin', { user_uuid: userId });
              
            if (!adminError && adminData) {
              return adminData as UserProfile;
            }
          } catch (rpcError) {
            console.warn('RPC fallback failed:', rpcError);
          }
        }
        
        // For any error, create fallback profile from auth metadata
        console.warn('Creating fallback profile from auth metadata due to error:', error.message);
        const { data: userData } = await supabase.auth.getUser(userId);
        if (userData.user) {
          return {
            id: userId,
            user_id: userId,
            role: 'client' as UserRole,
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
            phone: userData.user.user_metadata?.phone || '',
            created_at: userData.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      // Even on unexpected error, try to create fallback
      try {
        const { data: userData } = await supabase.auth.getUser(userId);
        if (userData.user) {
          return {
            id: userId,
            user_id: userId,
            role: 'client' as UserRole,
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
            phone: userData.user.user_metadata?.phone || '',
            created_at: userData.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
      } catch (authError) {
        console.error('Failed to get user data for fallback:', authError);
      }
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth...');
        setLoading(true);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
        );
        
        const authPromise = supabase.auth.getSession();
        
        // Race between auth session and timeout
        const { data: { session }, error } = await Promise.race([authPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('AuthContext: Session found:', session?.user?.email);

        if (session?.user) {
          setUser(session.user);
          setSession(session);
          
          // Fetch user profile to get role
          console.log('AuthContext: Fetching user profile for:', session.user.id);
          const userProfile = await fetchUserProfile(session.user.id);
          console.log('AuthContext: User profile result:', userProfile);
          
          if (userProfile) {
            setProfile(userProfile);
            setRole(userProfile.role);
            console.log('AuthContext: Profile set, role:', userProfile.role);
          } else {
            console.warn('AuthContext: No profile found, using fallback');
            // Create fallback profile to prevent loading state
            const fallbackProfile = {
              id: session.user.id,
              user_id: session.user.id,
              role: 'client' as UserRole,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
              phone: '',
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setProfile(fallbackProfile);
            setRole('client');
            console.log('AuthContext: Fallback profile created');
          }
        } else {
          console.log('AuthContext: No session found');
        }
      } catch (error) {
        console.error('Unexpected error initializing auth:', error);
        if (error.message === 'Auth initialization timeout') {
          console.warn('Auth initialization timed out, setting loading to false');
        }
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Set loading to true during auth state changes
        if (event !== 'INITIAL_SESSION') {
          setLoading(true);
        }
        
        setUser(session?.user || null);
        setSession(session || null);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile) {
            setProfile(userProfile);
            setRole(userProfile.role);
          } else {
            setProfile(null);
            setRole(null);
          }
        } else {
          setProfile(null);
          setRole(null);
        }
        
        // Always set loading to false after processing
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: FriendlyError; role?: UserRole }> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const friendlyError = getFriendlyErrorMessage(error);
        console.error('Login error:', error);
        return { success: false, error: friendlyError };
      }

      if (data.user && data.session) {
        // Set user and session state
        setUser(data.user);
        setSession(data.session);
        
        // Fetch user profile
        const userProfile = await fetchUserProfile(data.user.id);
        if (userProfile) {
          setProfile(userProfile);
          setRole(userProfile.role);
          console.log('AuthContext: Login successful, role:', userProfile.role);
          return { success: true, role: userProfile.role };
        } else {
          // Create fallback profile
          const fallbackProfile = {
            id: data.user.id,
            user_id: data.user.id,
            role: 'client' as UserRole,
            full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '',
            phone: '',
            created_at: data.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
          setRole('client');
          console.log('AuthContext: Login successful with fallback role: client');
          return { success: true, role: 'client' };
        }
      }

      return { success: false, error: { title: 'Login Failed', message: 'Unknown error occurred', type: 'error' as const } };
    } catch (error) {
      console.error('Unexpected login error:', error);
      const friendlyError = getFriendlyErrorMessage(error);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: getConfirmationRedirectUrl(),
        }
      });

      if (error) {
        return { success: false, error: getFriendlyErrorMessage(error) };
      }

      return { 
        success: true, 
        data: data.user,
        message: 'Account created successfully! Please check your email to confirm your account.'
      };

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            role: 'client', // Default role
            full_name: fullName || data.user.email?.split('@')[0] || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Still return success since auth worked, but log the error
        }

        return { success: true };
      }

        return { success: false, error: { title: 'Sign Up Failed', message: 'Unknown error occurred', type: 'error' as const } };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      const friendlyError = getFriendlyErrorMessage(error);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: FriendlyError }> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getPasswordResetRedirectUrl(),
      });

      if (error) {
        const friendlyError = getFriendlyErrorMessage(error);
        console.error('Password reset error:', error);
        return { success: false, error: friendlyError };
      }

      return { 
        success: true, 
        error: { 
          title: 'Password Reset Email Sent', 
          message: 'Check your email for password reset instructions.', 
          type: 'info',
          action: 'Follow the link in your email to reset your password.'
        } 
      };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      const friendlyError = getFriendlyErrorMessage(error);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Clear all auth state first
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear any remaining localStorage data
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.refreshToken');
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileUpdate: Partial<UserProfile>): Promise<{ success: boolean; error?: FriendlyError }> => {
    try {
      if (!user) {
        return { success: false, error: { title: 'Not Authenticated', message: 'You must be logged in to update your profile.', type: 'error' } };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...profileUpdate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        const friendlyError = getFriendlyErrorMessage(error);
        console.error('Profile update error:', error);
        return { success: false, error: friendlyError };
      }

      if (data) {
        setProfile({ ...profile, ...data });
        return { success: true };
      }

      return { success: false, error: { title: 'Update Failed', message: 'Unknown error occurred', type: 'error' } };
    } catch (error) {
      console.error('Unexpected profile update error:', error);
      const friendlyError = getFriendlyErrorMessage(error);
      return { success: false, error: friendlyError };
    }
  };

  // Handle automatic redirect after login
  useEffect(() => {
    if (user && role && !loading) {
      console.log('AuthContext: User logged in with role:', role);
      // This will trigger the redirect in the login pages
    }
  }, [user, role, loading]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    role,
    login,
    logout,
    signUp,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
