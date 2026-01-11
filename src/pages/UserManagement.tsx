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
import { userService, AuthUser, UserProfile, CreateUserData } from '@/services/userService';

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.getUsers();
      
      if (result.error) {
        setError(result.error.message || 'Failed to fetch users');
      } else {
        setUsers(result.data || []);
      }
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      const result = await userService.createUser(userData);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to create user",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `User ${userData.email} created successfully`,
          variant: "default",
        });
        setIsCreateDialogOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'client' | 'admin' | 'agent') => {
    try {
      const result = await userService.updateUserRole(userId, newRole);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to update user role",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `User role updated to ${newRole}`,
          variant: "default",
        });
        fetchUsers();
      }
    } catch (error) {
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
      const result = await userService.deleteUser(userId);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to delete user",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "User deleted successfully",
          variant: "default",
        });
        fetchUsers();
      }
    } catch (error) {
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
      const result = await userService.inviteUser(inviteEmail, inviteRole, inviteCompanyId || undefined);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to invite user",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: result.error?.message || `Invitation sent to ${inviteEmail}`,
          variant: "default",
        });
        setInviteEmail('');
        setInviteRole('client');
        setInviteCompanyId('');
      }
    } catch (error) {
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

  if (currentRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access user management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
