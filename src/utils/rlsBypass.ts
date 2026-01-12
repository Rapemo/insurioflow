// RLS Bypass utilities for development and admin operations
import { serviceClient } from '@/integrations/supabase/serviceClient';
import { supabase } from '@/integrations/supabase/client';

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

/**
 * Check if service role key is available
 */
export const hasServiceKey = (): boolean => {
  return !!serviceClient;
};

/**
 * Create user profile using service role key (bypasses RLS)
 */
export const createProfileWithServiceKey = async (profileData: Partial<UserProfile>): Promise<{ data?: UserProfile; error?: any }> => {
  if (!serviceClient) {
    return { error: new Error('Service role key not available') };
  }

  try {
    console.log('🔑 Using service role key to create profile (RLS bypass)');
    
    const { data, error } = await serviceClient
      .from('user_profiles')
      .insert({
        user_id: profileData.user_id!,
        role: profileData.role || 'client',
        company_id: profileData.company_id,
        full_name: profileData.full_name,
        phone: profileData.phone,
        avatar_url: profileData.avatar_url,
        preferences: profileData.preferences || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Service key profile creation failed:', error);
      return { error };
    }

    console.log('✅ Service key profile created successfully:', data);
    return { data: data as UserProfile };
  } catch (error) {
    console.error('❌ Service key operation failed:', error);
    return { error };
  }
};

/**
 * Get all user profiles using service role key (bypasses RLS)
 */
export const getAllProfilesWithServiceKey = async (): Promise<{ data?: UserProfile[]; error?: any }> => {
  if (!serviceClient) {
    return { error: new Error('Service role key not available') };
  }

  try {
    console.log('🔑 Using service role key to fetch all profiles (RLS bypass)');
    
    const { data, error } = await serviceClient
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Service key profiles fetch failed:', error);
      return { error };
    }

    console.log('✅ Service key profiles fetched successfully:', data?.length || 0);
    return { data: data as UserProfile[] || [] };
  } catch (error) {
    console.error('❌ Service key operation failed:', error);
    return { error };
  }
};

/**
 * Update user profile using service role key (bypasses RLS)
 */
export const updateProfileWithServiceKey = async (userId: string, updates: Partial<UserProfile>): Promise<{ data?: UserProfile; error?: any }> => {
  if (!serviceClient) {
    return { error: new Error('Service role key not available') };
  }

  try {
    console.log('🔑 Using service role key to update profile (RLS bypass)');
    
    const { data, error } = await serviceClient
      .from('user_profiles')
      .update({
        role: updates.role,
        company_id: updates.company_id,
        full_name: updates.full_name,
        phone: updates.phone,
        avatar_url: updates.avatar_url,
        preferences: updates.preferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Service key profile update failed:', error);
      return { error };
    }

    console.log('✅ Service key profile updated successfully:', data);
    return { data: data as UserProfile };
  } catch (error) {
    console.error('❌ Service key operation failed:', error);
    return { error };
  }
};

/**
 * Delete user profile using service role key (bypasses RLS)
 */
export const deleteProfileWithServiceKey = async (userId: string): Promise<{ error?: any }> => {
  if (!serviceClient) {
    return { error: new Error('Service role key not available') };
  }

  try {
    console.log('🔑 Using service role key to delete profile (RLS bypass)');
    
    const { error } = await serviceClient
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Service key profile deletion failed:', error);
      return { error };
    }

    console.log('✅ Service key profile deleted successfully');
    return {};
  } catch (error) {
    console.error('❌ Service key operation failed:', error);
    return { error };
  }
};
