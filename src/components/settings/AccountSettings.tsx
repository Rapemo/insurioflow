import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Shield, Camera, Edit2, Key } from 'lucide-react';

export const AccountSettings = () => {
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@insurio-flow.com',
    phone: '+254 712 345 678',
    title: 'Insurance Broker',
    department: 'Sales',
    employeeId: 'EMP001',
    joinDate: '2023-01-15',
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your personal account details and profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {userProfile.firstName[0]}{userProfile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  {isEditing ? (
                    <Input
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium">{userProfile.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  {isEditing ? (
                    <Input
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium">{userProfile.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{userProfile.email}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  {isEditing ? (
                    <Input
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{userProfile.phone}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  {isEditing ? (
                    <Input
                      value={userProfile.title}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, title: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium">{userProfile.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  {isEditing ? (
                    <Input
                      value={userProfile.department}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, department: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium">{userProfile.department}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Details
          </CardTitle>
          <CardDescription>
            Your account information and access details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <p className="text-sm font-medium">{userProfile.employeeId}</p>
            </div>
            <div className="space-y-2">
              <Label>Join Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">{userProfile.joinDate}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Account Status</Label>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="space-y-2">
              <Label>Last Login</Label>
              <p className="text-sm font-medium">Dec 24, 2025 at 4:30 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password & Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Change Password</h4>
              <p className="text-sm text-muted-foreground">
                Update your account password for enhanced security
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
