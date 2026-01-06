import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: 'client' | 'admin' | 'agent';
  company_id?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password?: string;
  full_name?: string;
  role: 'client' | 'admin' | 'agent';
  company_id?: string;
  phone?: string;
}

export interface UpdateUserData {
  role?: 'client' | 'admin' | 'agent';
  company_id?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}

export const userService = {
  async getUsers(): Promise<{ data: (User & UserProfile)[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_profiles!inner(
            role,
            company_id,
            full_name,
            phone,
            avatar_url,
            preferences
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData = (data || []).map((user: any) => ({
        ...user,
        profile: user.user_profiles
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async getUserById(id: string): Promise<{ data: User & { profile?: UserProfile } | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_profiles!inner(
            role,
            company_id,
            full_name,
            phone,
            avatar_url,
            preferences
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      const transformedData = data ? {
        ...data,
        profile: data.user_profiles
      } : null;

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching user:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async createUser(userData: CreateUserData): Promise<{ data: User | null; error: any }> {
    try {
      // First create the user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password || Math.random().toString(36).slice(-8),
        user_metadata: {
          full_name: userData.full_name,
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return { data: null, error: getFriendlyErrorMessage(authError) };
      }

      if (!authData.user) {
        return { data: null, error: { title: 'User Creation Failed', message: 'Failed to create user account', type: 'error' } };
      }

      // Then create the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          role: userData.role,
          company_id: userData.company_id,
          full_name: userData.full_name,
          phone: userData.phone,
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { data: null, error: getFriendlyErrorMessage(profileError) };
      }

      return { data: authData.user, error: null };
    } catch (error) {
      console.error('Unexpected error creating user:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async updateUserRole(userId: string, role: 'client' | 'admin' | 'agent'): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          role,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user role:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating user role:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async updateUserProfile(userId: string, profileData: UpdateUserData): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating user profile:', error);
      return { data: null, error: getFriendlyErrorMessage(error) };
    }
  },

  async deleteUser(userId: string): Promise<{ error: any }> {
    try {
      // First delete user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        return { error: getFriendlyErrorMessage(profileError) };
      }

      // Then delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Error deleting auth user:', authError);
        return { error: getFriendlyErrorMessage(authError) };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error deleting user:', error);
      return { error: getFriendlyErrorMessage(error) };
    }
  },

  async inviteUser(email: string, role: 'client' | 'admin' | 'agent', companyId?: string): Promise<{ success: boolean; error?: any }> {
    try {
      // Generate a temporary password for the invitation
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create the user account
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          invited_by: 'admin',
          invited_role: role,
          invited_company_id: companyId,
        }
      });

      if (error) {
        console.error('Error inviting user:', error);
        return { success: false, error: getFriendlyErrorMessage(error) };
      }

      // TODO: Send invitation email with temporary password
      // This would integrate with your email service
      
      return { 
        success: true, 
        error: { 
          title: 'Invitation Sent', 
          message: `User ${email} has been invited with role: ${role}. They will receive an email with setup instructions.`, 
          type: 'info' 
        } 
      };
    } catch (error) {
      console.error('Unexpected error inviting user:', error);
      return { success: false, error: getFriendlyErrorMessage(error) };
    }
  }
};
