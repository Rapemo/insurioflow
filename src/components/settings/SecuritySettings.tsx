import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Key, Smartphone, Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

export const SecuritySettings = () => {
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: 90,
  });

  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: 30,
    maxConcurrentSessions: 3,
    requireReauth: false,
    autoLogout: true,
  });

  const [twoFactorSettings, setTwoFactorSettings] = useState({
    enabled: false,
    method: 'sms',
    backupCodes: 5,
  });

  const [auditSettings, setAuditSettings] = useState({
    logFailedAttempts: true,
    logSuccessfulLogins: true,
    logPasswordChanges: true,
    logDataAccess: true,
    retentionPeriod: 365,
  });

  return (
    <div className="space-y-6">
      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Policy
          </CardTitle>
          <CardDescription>
            Configure password requirements and security policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-length">Minimum Password Length</Label>
              <Input
                id="min-length"
                type="number"
                value={passwordSettings.minLength}
                onChange={(e) => setPasswordSettings(prev => ({ ...prev, minLength: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
              <Input
                id="password-expiry"
                type="number"
                value={passwordSettings.passwordExpiry}
                onChange={(e) => setPasswordSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Password Requirements</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Uppercase Letters</Label>
                  <p className="text-sm text-muted-foreground">Passwords must contain at least one uppercase letter</p>
                </div>
                <Switch
                  checked={passwordSettings.requireUppercase}
                  onCheckedChange={(checked) => setPasswordSettings(prev => ({ ...prev, requireUppercase: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Lowercase Letters</Label>
                  <p className="text-sm text-muted-foreground">Passwords must contain at least one lowercase letter</p>
                </div>
                <Switch
                  checked={passwordSettings.requireLowercase}
                  onCheckedChange={(checked) => setPasswordSettings(prev => ({ ...prev, requireLowercase: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Numbers</Label>
                  <p className="text-sm text-muted-foreground">Passwords must contain at least one number</p>
                </div>
                <Switch
                  checked={passwordSettings.requireNumbers}
                  onCheckedChange={(checked) => setPasswordSettings(prev => ({ ...prev, requireNumbers: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Special Characters</Label>
                  <p className="text-sm text-muted-foreground">Passwords must contain at least one special character</p>
                </div>
                <Switch
                  checked={passwordSettings.requireSpecialChars}
                  onCheckedChange={(checked) => setPasswordSettings(prev => ({ ...prev, requireSpecialChars: checked }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Session Management
          </CardTitle>
          <CardDescription>
            Configure user session settings and timeouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={sessionSettings.sessionTimeout}
                onChange={(e) => setSessionSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
              <Input
                id="max-sessions"
                type="number"
                value={sessionSettings.maxConcurrentSessions}
                onChange={(e) => setSessionSettings(prev => ({ ...prev, maxConcurrentSessions: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Re-authentication</Label>
                <p className="text-sm text-muted-foreground">Ask users to re-authenticate for sensitive actions</p>
              </div>
              <Switch
                checked={sessionSettings.requireReauth}
                onCheckedChange={(checked) => setSessionSettings(prev => ({ ...prev, requireReauth: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-logout on Inactivity</Label>
                <p className="text-sm text-muted-foreground">Automatically log out users after period of inactivity</p>
              </div>
              <Switch
                checked={sessionSettings.autoLogout}
                onCheckedChange={(checked) => setSessionSettings(prev => ({ ...prev, autoLogout: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Configure 2FA settings and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
            </div>
            <Switch
              checked={twoFactorSettings.enabled}
              onCheckedChange={(checked) => setTwoFactorSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {twoFactorSettings.enabled && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Default 2FA Method</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button
                    variant={twoFactorSettings.method === 'sms' ? 'default' : 'outline'}
                    onClick={() => setTwoFactorSettings(prev => ({ ...prev, method: 'sms' }))}
                    className="justify-start"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                  <Button
                    variant={twoFactorSettings.method === 'email' ? 'default' : 'outline'}
                    onClick={() => setTwoFactorSettings(prev => ({ ...prev, method: 'email' }))}
                    className="justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant={twoFactorSettings.method === 'app' ? 'default' : 'outline'}
                    onClick={() => setTwoFactorSettings(prev => ({ ...prev, method: 'app' }))}
                    className="justify-start"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    App
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-codes">Number of Backup Codes</Label>
                <Input
                  id="backup-codes"
                  type="number"
                  value={twoFactorSettings.backupCodes}
                  onChange={(e) => setTwoFactorSettings(prev => ({ ...prev, backupCodes: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Audit Logging
          </CardTitle>
          <CardDescription>
            Configure security event logging and monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Log Events</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Log Failed Login Attempts</Label>
                  <p className="text-sm text-muted-foreground">Record all failed authentication attempts</p>
                </div>
                <Switch
                  checked={auditSettings.logFailedAttempts}
                  onCheckedChange={(checked) => setAuditSettings(prev => ({ ...prev, logFailedAttempts: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Log Successful Logins</Label>
                  <p className="text-sm text-muted-foreground">Record all successful authentication attempts</p>
                </div>
                <Switch
                  checked={auditSettings.logSuccessfulLogins}
                  onCheckedChange={(checked) => setAuditSettings(prev => ({ ...prev, logSuccessfulLogins: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Log Password Changes</Label>
                  <p className="text-sm text-muted-foreground">Record all password change events</p>
                </div>
                <Switch
                  checked={auditSettings.logPasswordChanges}
                  onCheckedChange={(checked) => setAuditSettings(prev => ({ ...prev, logPasswordChanges: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Log Data Access</Label>
                  <p className="text-sm text-muted-foreground">Record sensitive data access events</p>
                </div>
                <Switch
                  checked={auditSettings.logDataAccess}
                  onCheckedChange={(checked) => setAuditSettings(prev => ({ ...prev, logDataAccess: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="retention-period">Log Retention Period (days)</Label>
            <Input
              id="retention-period"
              type="number"
              value={auditSettings.retentionPeriod}
              onChange={(e) => setAuditSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>
            Current security configuration status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Strong Password Policy</p>
                <p className="text-sm text-muted-foreground">All requirements enabled</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Not enforced for all users</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Session Management</p>
                <p className="text-sm text-muted-foreground">Secure timeout configured</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Audit Logging</p>
                <p className="text-sm text-muted-foreground">All security events logged</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Security Settings</Button>
      </div>
    </div>
  );
};
