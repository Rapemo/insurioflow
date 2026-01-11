// Legacy userService - DEPRECATED
// Use userApiService from '@/api' instead
// This file is kept for backward compatibility

import { userApiService, type UserWithProfile, type CreateUserData, type UpdateUserData } from '@/api';

// Re-export for backward compatibility
export const userService = {
  getUsers: () => userApiService.getUsersWithProfiles(),
  getUserById: (id: string) => userApiService.getUserByIdWithProfile(id),
  createUser: (data: CreateUserData) => userApiService.createUserWithProfile(data),
  updateUser: (id: string, data: UpdateUserData) => userApiService.updateUserProfile(id, data),
  deleteUser: (id: string) => userApiService.deleteUserWithProfile(id),
  getUsersByRole: (role: 'client' | 'admin' | 'agent') => userApiService.getUsersByRole(role),
  getUsersByCompany: (companyId: string) => userApiService.getUsersByCompany(companyId),
  searchUsers: (query: string) => userApiService.searchUsers(query),
  inviteUser: (email: string, role: string, companyId?: string) => userApiService.inviteUser(email, role, companyId)
};

// Re-export types for backward compatibility
export type { AuthUser, UserProfile, CreateUserData, UpdateUserData, UserWithProfile } from '@/api';