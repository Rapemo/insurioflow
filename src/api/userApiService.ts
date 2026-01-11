import { BaseService } from './baseService';
import { ApiResponse, PaginationParams, FilterParams } from './apiClient';
import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

// User interfaces
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
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
  full_name?: string;
  role?: 'client' | 'admin' | 'agent';
  company_id?: string;
  phone?: string;
  preferences?: Record<string, any>;
}

export interface UserWithProfile extends AuthUser {
  profile?: UserProfile;
}

/**
 * User API Service - Clean separation between frontend and backend
 */
class UserApiService extends BaseService<UserProfile, CreateUserData, UpdateUserData> {
  protected tableName = 'user_profiles';

  /**
   * Get all users with their profiles
   */
  async getUsersWithProfiles(
    filters?: FilterParams,
    pagination?: PaginationParams
  ): Promise<ApiResponse<UserWithProfile[]>> {
    return this.customQuery(async () => {
      // Get all users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return { data: null, error: getFriendlyErrorMessage(authError) };
      }

      if (!authUsers || authUsers.users.length === 0) {
        return { data: [], error: null };
      }

      // Get user profiles for all users
      const userIds = authUsers.users.map(user => user.id);
      let profilesQuery = supabase
        .from(this.tableName)
        .select('*')
        .in('user_id', userIds);

      // Apply filters
      if (filters?.role) {
        profilesQuery = profilesQuery.eq('role', filters.role);
      }
      if (filters?.company_id) {
        profilesQuery = profilesQuery.eq('company_id', filters.company_id);
      }

      const { data: profiles, error: profileError } = await profilesQuery;

      if (profileError) {
        console.error('Error fetching user profiles:', profileError);
        return { data: null, error: getFriendlyErrorMessage(profileError) };
      }

      // Combine auth users with their profiles
      const transformedData = authUsers.users.map((authUser: any) => {
        const profile = profiles?.find((p: any) => p.user_id === authUser.id);
        return {
          ...authUser,
          profile
        };
      });

      // Apply pagination to the combined data
      let filteredData = transformedData;
      
      if (filters?.search) {
        filteredData = filteredData.filter((user: any) => 
          user.email?.toLowerCase().includes(filters.search!.toLowerCase()) ||
          user.profile?.full_name?.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (pagination?.page && pagination?.limit) {
        const offset = (pagination.page - 1) * pagination.limit;
        filteredData = filteredData.slice(offset, offset + pagination.limit);
      }

      return { data: filteredData, error: null };
    });
  }

  /**
   * Get user by ID with profile
   */
  async getUserByIdWithProfile(id: string): Promise<ApiResponse<UserWithProfile>> {
    return this.customQuery(async () => {
      // Get user from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(id);
      
      if (authError) {
        console.error('Error fetching auth user:', authError);
        return { data: null, error: getFriendlyErrorMessage(authError) };
      }

      if (!authUser.user) {
        return { data: null, error: { title: 'User Not Found', message: 'User not found', type: 'error' } };
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
        return { data: null, error: getFriendlyErrorMessage(profileError) };
      }

      return {
        data: {
          ...authUser.user,
          profile: profile || undefined
        },
        error: null
      };
    });
  }

  /**
   * Create new user with profile
   */
  async createUserWithProfile(data: CreateUserData): Promise<ApiResponse<UserWithProfile>> {
    return this.customQuery(async () => {
      // Create user in auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password || Math.random().toString(36).slice(-8),
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return { data: null, error: getFriendlyErrorMessage(authError) };
      }

      if (!authUser.user) {
        return { data: null, error: { title: 'Creation Failed', message: 'Failed to create user', type: 'error' } };
      }

      // Create user profile
      const profileData = {
        user_id: authUser.user.id,
        role: data.role,
        company_id: data.company_id,
        full_name: data.full_name,
        phone: data.phone
      };

      const { data: profile, error: profileError } = await supabase
        .from(this.tableName)
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Rollback auth user creation
        await supabase.auth.admin.deleteUser(authUser.user.id);
        return { data: null, error: getFriendlyErrorMessage(profileError) };
      }

      return {
        data: {
          ...authUser.user,
          profile
        },
        error: null
      };
    });
  }

  /**
   * Update user profile
   */
  async updateUserProfile(id: string, data: UpdateUserData): Promise<ApiResponse<UserProfile>> {
    return this.update(id, data);
  }

  /**
   * Delete user and profile
   */
  async deleteUserWithProfile(id: string): Promise<ApiResponse<void>> {
    return this.customQuery(async () => {
      // Delete profile first
      const { error: profileError } = await supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', id);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        return { data: null, error: getFriendlyErrorMessage(profileError) };
      }

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(id);

      if (authError) {
        console.error('Error deleting auth user:', authError);
        return { data: null, error: getFriendlyErrorMessage(authError) };
      }

      return { data: null, error: null };
    });
  }

  /**
   * Get users by role
   */
  async getUsersByRole(
    role: 'client' | 'admin' | 'agent',
    pagination?: PaginationParams
  ): Promise<ApiResponse<UserWithProfile[]>> {
    return this.getUsersWithProfiles({ role }, pagination);
  }

  /**
   * Get users by company
   */
  async getUsersByCompany(
    companyId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<UserWithProfile[]>> {
    return this.getUsersWithProfiles({ company_id: companyId }, pagination);
  }

  /**
   * Search users
   */
  async searchUsers(
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<UserWithProfile[]>> {
    return this.getUsersWithProfiles({ search: query }, pagination);
  }

  /**
   * Invite user
   */
  async inviteUser(email: string, role: string, companyId?: string): Promise<ApiResponse<void>> {
    return this.customQuery(async () => {
      const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
          role,
          company_id: companyId
        }
      });

      if (error) {
        console.error('Error inviting user:', error);
        return { data: null, error: getFriendlyErrorMessage(error) };
      }

      return { data: null, error: null };
    });
  }
}

// Export singleton instance
export const userApiService = new UserApiService();
export type { AuthUser, UserProfile, CreateUserData, UpdateUserData, UserWithProfile };
