import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Shield,
  UserCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { userProfileService, UserProfileWithCreator, CreateUserProfileData } from '@/services/userProfileService';
import { toast } from 'sonner';

const UserProfileManagement = () => {
  const [profiles, setProfiles] = useState<UserProfileWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'admin' | 'agent'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfileWithCreator | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for creating/editing profiles
  const [formData, setFormData] = useState<CreateUserProfileData>({
    user_id: '',
    role: 'client',
    full_name: '',
    phone: '',
    company_id: '',
    preferences: {}
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (roleFilter === 'all') {
        const data = await userProfileService.getCreatedUserProfiles();
        setProfiles(data);
      } else {
        const data = await userProfileService.getUserProfilesByRole(roleFilter);
        setProfiles(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profiles');
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!formData.user_id || !formData.full_name) {
      toast.error('User ID and Full Name are required');
      return;
    }

    try {
      setIsSubmitting(true);
      await userProfileService.createUserProfile(formData);
      toast.success('User profile created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchProfiles();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile || !formData.full_name) {
      toast.error('Full Name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await userProfileService.updateUserProfile(editingProfile.user_id, {
        full_name: formData.full_name,
        phone: formData.phone,
        company_id: formData.company_id,
        preferences: formData.preferences
      });
      toast.success('User profile updated successfully');
      setEditingProfile(null);
      resetForm();
      fetchProfiles();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProfile = async (userId: string, fullName: string) => {
    if (!confirm(`Are you sure you want to delete the profile for ${fullName}?`)) {
      return;
    }

    try {
      await userProfileService.deleteUserProfile(userId);
      toast.success('User profile deleted successfully');
      fetchProfiles();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user profile');
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      role: 'client',
      full_name: '',
      phone: '',
      company_id: '',
      preferences: {}
    });
  };

  const openEditDialog = (profile: UserProfileWithCreator) => {
    setEditingProfile(profile);
    setFormData({
      user_id: profile.user_id,
      role: profile.role,
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      company_id: profile.company_id || '',
      preferences: profile.preferences || {}
    });
  };

  const filteredProfiles = profiles.filter(profile => 
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.phone?.includes(searchTerm)
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'agent': return 'default';
      case 'client': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading user profiles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">User Profile Management</h1>
          <Badge variant="outline" className="ml-2">
            Admin Only
          </Badge>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Profile
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Filter and search user profiles you have created
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="role-filter">Role Filter</Label>
              <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="agent">Agents</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profiles List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Profiles ({filteredProfiles.length})
          </CardTitle>
          <CardDescription>
            Profiles you have created and can manage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No user profiles found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first user profile'
                }
              </p>
              {!searchTerm && roleFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Profile
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.user_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{profile.full_name}</h3>
                      <Badge variant={getRoleBadgeVariant(profile.role)}>
                        {profile.role}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {profile.phone && <p>Phone: {profile.phone}</p>}
                      <p>User ID: {profile.user_id}</p>
                      <p>Created: {new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(profile)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProfile(profile.user_id, profile.full_name || 'Unknown')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      {(isCreateDialogOpen || editingProfile) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingProfile ? 'Edit User Profile' : 'Create User Profile'}
              </CardTitle>
              <CardDescription>
                {editingProfile 
                  ? 'Update the user profile information'
                  : 'Create a new user profile for authentication'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_id">User ID *</Label>
                <Input
                  id="user_id"
                  placeholder="Enter user UUID"
                  value={formData.user_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                  disabled={!!editingProfile} // Can't change user ID when editing
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}
                  disabled={!!editingProfile} // Can't change role when editing
                >
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

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id">Company ID</Label>
                <Input
                  id="company_id"
                  placeholder="Enter company UUID (optional)"
                  value={formData.company_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                />
              </div>
            </CardContent>

            <div className="flex justify-end space-x-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingProfile(null);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={editingProfile ? handleUpdateProfile : handleCreateProfile}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editingProfile ? 'Update' : 'Create'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserProfileManagement;
