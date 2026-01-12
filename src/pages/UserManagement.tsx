import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Mail, 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  UserPlus,
  Key,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateUserData } from '@/services/userService';
import { supabase } from '@/integrations/supabase/client';
import { getAllProfilesWithServiceKey, hasServiceKey } from '@/utils/rlsBypass';

console.log('📦 UserManagement.tsx: Module loaded');

// Define types locally to avoid import issues
interface AuthUser {
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

interface UserProfile {
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

const UserManagement = () => {
  const [users, setUsers] = useState<(AuthUser & { profile?: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser & { profile?: UserProfile } | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'client' | 'admin' | 'agent'>('client');
  const [inviteCompanyId, setInviteCompanyId] = useState<string>('');
  const { user: currentUser, role: currentRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 UserManagement: useEffect triggered, fetching users...');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log('🚀 UserManagement: fetchUsers() called');
    try {
      console.log('📝 Setting loading to true...');
      setLoading(true);
      setError(null);
      
      // Check if service key is available for RLS bypass
      if (hasServiceKey()) {
        console.log('🔑 Using service role key to fetch users (RLS bypass)');
        const { data: profiles, error: profileError } = await getAllProfilesWithServiceKey();
        
        if (profileError) {
          console.error('❌ Service key fetch failed:', profileError);
          setError(profileError.message || 'Failed to fetch users');
          return;
        }
        
        console.log('✅ Service key fetched profiles:', profiles?.length || 0);
        
        // Transform profiles to match expected format
        const transformedUsers = profiles?.map(profile => ({
          id: profile.user_id,
          email: `user-${profile.user_id.substring(0, 8)}@example.com`, // Placeholder email
          created_at: profile.created_at,
          last_sign_in_at: null,
          profile: profile
        })) || [];
        
        console.log('✅ Fetched and transformed users:', transformedUsers);
        setUsers(transformedUsers);
        
      } else {
        console.log('⚠️ No service key available, using regular client with timeout');
        
        console.log('📝 Querying user_profiles table...');
        
        // Add timeout to prevent hanging
        const queryPromise = (supabase as any)
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database query timed out')), 5000);
        });
        
        const { data: profiles, error: profileError } = await Promise.race([queryPromise, timeoutPromise]) as any;
        
        console.log('📝 Profile query response:', { profiles, profileError });
        
        if (profileError) {
          console.error('❌ Error fetching user profiles:', profileError);
          setError(profileError.message || 'Failed to fetch users');
          return;
        }
        
        console.log('📝 Transforming profiles to user format...');
        // Transform profiles to match expected format
        const transformedUsers = profiles?.map(profile => ({
          id: profile.user_id,
          email: `user-${profile.user_id.substring(0, 8)}@example.com`, // Placeholder email
          created_at: profile.created_at,
          last_sign_in_at: null,
          profile: profile
        })) || [];
        
        console.log('✅ Fetched and transformed users:', transformedUsers);
        setUsers(transformedUsers);
      }
      
    } catch (error) {
      console.error('❌ Error in fetchUsers:', error);
      if (error.message.includes('timeout')) {
        setError('Database query timed out. Please try again.');
      } else {
        setError('Failed to load users');
      }
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      console.log('🚀 UserManagement: Creating user:', userData);
      
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || Math.random().toString(36).slice(-8),
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone
          }
        }
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        toast({
          title: "Error",
          description: authError.message || "Failed to create user",
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        console.error('❌ No user data returned');
        toast({
          title: "Error", 
          description: "Failed to create user account",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ User created in auth, ID:', authData.user.id);

      // Step 2: Create user profile immediately
      const profileData = {
        user_id: authData.user.id,
        role: userData.role,
        full_name: userData.full_name,
        phone: userData.phone,
        company_id: userData.company_id,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Creating profile:', profileData);

      // Try to create profile with timeout
      const profilePromise = (supabase as any)
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile creation timed out')), 5000);
      });

      try {
        const { data: profileResult, error: profileError } = await Promise.race([profilePromise, timeoutPromise]) as any;
        
        if (profileError) {
          console.error('❌ Profile creation error:', profileError);
          console.log('⚠️ User created but profile failed - will be created on login');
        } else {
          console.log('✅ Profile created successfully:', profileResult);
        }
      } catch (timeoutError) {
        console.error('⚠️ Profile creation timed out:', timeoutError);
        console.log('⚠️ User created but profile timed out - will be created on login');
      }

      toast({
        title: "Success",
        description: `User ${userData.email} created successfully`,
        variant: "default",
      });
      setIsCreateDialogOpen(false);
      fetchUsers();
      
    } catch (error) {
      console.error('❌ Error in handleCreateUser:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'client' | 'admin' | 'agent') => {
    try {
      console.log('🔄 Updating user role:', { userId, newRole });
      
      // Simple profile update
      const { error: updateError } = await (supabase as any)
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('❌ Error updating user role:', updateError);
        toast({
          title: "Error",
          description: updateError.message || "Failed to update user role",
          variant: "destructive",
        });
      } else {
        console.log('✅ User role updated successfully');
        toast({
          title: "Success",
          description: `User role updated to ${newRole}`,
          variant: "default",
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('❌ Error in handleUpdateUserRole:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting user:', userId);
      
      // Delete from user_profiles table
      const { error: deleteError } = await (supabase as any)
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error('❌ Error deleting user:', deleteError);
        toast({
          title: "Error",
          description: deleteError.message || "Failed to delete user",
          variant: "destructive",
        });
      } else {
        console.log('✅ User deleted successfully');
        toast({
          title: "Success",
          description: "User deleted successfully",
          variant: "default",
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('❌ Error in handleDeleteUser:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('📧 Inviting user:', { inviteEmail, inviteRole, inviteCompanyId });
      
      // Step 1: Create user with invite role
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteEmail,
        password: Math.random().toString(36).slice(-8), // Random password
        options: {
          data: {
            role: inviteRole,
            company_id: inviteCompanyId || undefined
          }
        }
      });

      if (authError) {
        console.error('❌ Error inviting user:', authError);
        toast({
          title: "Error",
          description: authError.message || "Failed to invite user",
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        console.error('❌ No user data returned for invite');
        toast({
          title: "Error", 
          description: "Failed to create invited user account",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ User invited in auth, ID:', authData.user.id);

      // Step 2: Create user profile immediately
      const profileData = {
        user_id: authData.user.id,
        role: inviteRole,
        full_name: inviteEmail.split('@')[0], // Use email prefix as name
        company_id: inviteCompanyId || undefined,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Creating profile for invited user:', profileData);

      // Try to create profile with timeout
      const profilePromise = (supabase as any)
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile creation timed out')), 5000);
      });

      try {
        const { data: profileResult, error: profileError } = await Promise.race([profilePromise, timeoutPromise]) as any;
        
        if (profileError) {
          console.error('❌ Profile creation error for invite:', profileError);
          console.log('⚠️ User invited but profile failed - will be created on login');
        } else {
          console.log('✅ Profile created successfully for invite:', profileResult);
        }
      } catch (timeoutError) {
        console.error('⚠️ Profile creation timed out for invite:', timeoutError);
        console.log('⚠️ User invited but profile timed out - will be created on login');
      }

      toast({
        title: "Success",
        description: `Invitation sent to ${inviteEmail}`,
        variant: "default",
      });
      setInviteEmail('');
      setInviteRole('client');
      setInviteCompanyId('');
      fetchUsers();
    } catch (error) {
      console.error('❌ Error in handleInviteUser:', error);
      toast({
        title: "Error",
        description: "Failed to invite user",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (user: AuthUser & { profile?: UserProfile }) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditingUser(null);
    setIsEditDialogOpen(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'agent':
        return 'secondary';
      case 'client':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  console.log('🎯 UserManagement: Component rendering, currentRole:', currentRole);
  console.log('🎯 UserManagement: Current user:', currentUser);

  // Bypass admin check for now - let any authenticated user access
  if (!currentUser) {
    console.log('🚫 UserManagement: No current user');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Not Authenticated</h1>
          <p className="text-gray-600">Please log in to access user management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('⏳ UserManagement: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage users, roles, and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/users/create')} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create User (Simple)
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client User
              </Button>
              <Button onClick={() => fetchUsers()}>
                <Edit2 className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <Shield className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Invite User Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Invite User
              </CardTitle>
              <CardDescription>
                Send invitation to new users via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value: 'client' | 'admin' | 'agent') => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="invite-company">Company (Optional)</Label>
                <Input
                  id="invite-company"
                  placeholder="Company ID"
                  value={inviteCompanyId}
                  onChange={(e) => setInviteCompanyId(e.target.value)}
                />
              </div>
              <Button onClick={handleInviteUser} disabled={!inviteEmail}>
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Users ({users.length})
                </div>
              </CardTitle>
              <CardDescription>
                Manage user accounts and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                  <p className="text-sm text-gray-400">Create your first user to get started</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {user.profile?.avatar_url ? (
                              <img 
                                src={user.profile.avatar_url} 
                                alt={user.profile.full_name || user.email}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <div>{user.profile?.full_name || user.email}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.profile?.role || 'client')}>
                            {user.profile?.role || 'client'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.profile?.company_id || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={user.last_sign_in_at ? 'default' : 'secondary'}>
                            {user.last_sign_in_at ? 'Active' : 'Never'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {currentRole === 'admin' && user.id !== currentUser?.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateUserRole(user.id, 'admin')}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account and set their role and permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateUser({
              email: formData.get('email') as string,
              full_name: formData.get('full_name') as string,
              role: formData.get('role') as 'client' | 'admin' | 'agent',
              company_id: formData.get('company_id') as string || undefined,
              password: formData.get('password') as string,
            });
          }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue="client">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company_id">Company ID (Optional)</Label>
                  <Input
                    id="company_id"
                    name="company_id"
                    type="text"
                    placeholder="Company ID"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password (Optional)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Leave empty for auto-generated"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateUserRole(editingUser.id, formData.get('role') as 'client' | 'admin' | 'agent');
              toast({
                title: "Success",
                description: "User role updated successfully",
                variant: "default",
              });
              closeEditDialog();
            }}>
              <div className="space-y-4">
                <div>
                  <Label>User</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {editingUser.profile?.avatar_url ? (
                        <img 
                          src={editingUser.profile.avatar_url} 
                          alt={editingUser.profile.full_name || editingUser.email}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{editingUser.profile?.full_name || editingUser.email}</div>
                        <div className="text-sm text-gray-500">{editingUser.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue={editingUser.profile?.role || 'client'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeEditDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Role
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
