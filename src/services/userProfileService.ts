import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export interface CreateUserProfileData {
  user_id: string;
  role: 'client' | 'admin' | 'agent';
  full_name?: string;
  phone?: string;
  company_id?: string;
  preferences?: Record<string, any>;
}

export interface UpdateUserProfileData {
  full_name?: string;
  phone?: string;
  company_id?: string;
  preferences?: Record<string, any>;
}

export interface UserProfileWithCreator extends UserProfile {
  created_by?: string;
}

class UserProfileService {
  // Get current user's profile to verify admin role
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();

      if (error) {
        console.error('Error fetching current user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  }

  // Check if current user is admin
  async isCurrentUserAdmin(): Promise<boolean> {
    const profile = await this.getCurrentUserProfile();
    return profile?.role === 'admin';
  }

  // Get all user profiles created by current admin
  async getCreatedUserProfiles(): Promise<UserProfileWithCreator[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Verify admin role
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Access denied: Admin role required');
      }

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('created_by', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching created user profiles:', error);
        throw error;
      }

      return data as UserProfileWithCreator[];
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }

  // Create new user profile (admin only)
  async createUserProfile(profileData: CreateUserProfileData): Promise<UserProfile> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Verify admin role
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Access denied: Admin role required');
      }

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .insert({
          ...profileData,
          created_by: userData.user.id,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }

  // Update user profile (admin only, for profiles they created)
  async updateUserProfile(
    userId: string, 
    updateData: UpdateUserProfileData
  ): Promise<UserProfile> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Verify admin role
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Access denied: Admin role required');
      }

      // Verify that current admin created this profile
      const { data: profileCheck } = await (supabase as any)
        .from('user_profiles')
        .select('created_by')
        .eq('user_id', userId)
        .single();

      if (profileCheck?.created_by !== userData.user.id) {
        throw new Error('Access denied: You can only edit profiles you created');
      }

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }

  // Delete user profile (admin only, for profiles they created)
  async deleteUserProfile(userId: string): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Verify admin role
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Access denied: Admin role required');
      }

      // Verify that current admin created this profile
      const { data: profileCheck } = await (supabase as any)
        .from('user_profiles')
        .select('created_by')
        .eq('user_id', userId)
        .single();

      if (profileCheck?.created_by !== userData.user.id) {
        throw new Error('Access denied: You can only delete profiles you created');
      }

      const { error } = await (supabase as any)
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting user profile:', error);
        throw error;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }

  // Get user profile by ID (admin only, for profiles they created)
  async getUserProfileById(userId: string): Promise<UserProfile> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Verify admin role
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Access denied: Admin role required');
      }

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      // Verify that current admin created this profile
      if (data.created_by !== userData.user.id) {
        throw new Error('Access denied: You can only view profiles you created');
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }

  // Get user profiles by role (admin only, for profiles they created)
  async getUserProfilesByRole(role: 'client' | 'admin' | 'agent'): Promise<UserProfileWithCreator[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Verify admin role
      const isAdmin = await this.isCurrentUserAdmin();
      if (!isAdmin) {
        throw new Error('Access denied: Admin role required');
      }

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('role', role)
        .eq('created_by', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user profiles by role:', error);
        throw error;
      }

      return data as UserProfileWithCreator[];
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();
