import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Smartphone, Volume2, MessageSquare, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

export const NotificationSettings = () => {
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    dailyDigest: true,
    weeklyReport: false,
    marketingEmails: false,
    productUpdates: true,
    securityAlerts: true,
  });

  const [pushSettings, setPushSettings] = useState({
    enabled: true,
    newMessages: true,
    taskReminders: true,
    mentions: true,
    systemUpdates: false,
  });

  const [smsSettings, setSmsSettings] = useState({
    enabled: false,
    criticalAlerts: true,
    appointmentReminders: true,
    securityAlerts: true,
  });

  const [inAppSettings, setInAppSettings] = useState({
    enabled: true,
    soundEnabled: true,
    desktopNotifications: true,
    badgeNotifications: true,
  });

  const notificationTypes = [
    {
      category: 'Policy Management',
      notifications: [
        { id: 'policy-issued', name: 'Policy Issued', description: 'When a new policy is issued', defaultEnabled: true },
        { id: 'policy-renewal', name: 'Policy Renewal Due', description: 'When policy renewal is approaching', defaultEnabled: true },
        { id: 'policy-expired', name: 'Policy Expired', description: 'When a policy has expired', defaultEnabled: true },
        { id: 'claim-updated', name: 'Claim Updated', description: 'When claim status changes', defaultEnabled: true },
      ]
    },
    {
      category: 'Client Management',
      notifications: [
        { id: 'new-client', name: 'New Client Added', description: 'When a new client is registered', defaultEnabled: true },
        { id: 'client-updated', name: 'Client Updated', description: 'When client information is updated', defaultEnabled: false },
        { id: 'client-birthday', name: 'Client Birthday', description: 'Client birthday reminder', defaultEnabled: false },
      ]
    },
    {
      category: 'Financial',
      notifications: [
        { id: 'payment-received', name: 'Payment Received', description: 'When a payment is processed', defaultEnabled: true },
        { id: 'payment-overdue', name: 'Payment Overdue', description: 'When a payment is overdue', defaultEnabled: true },
        { id: 'commission-calculated', name: 'Commission Calculated', description: 'When commission is calculated', defaultEnabled: true },
      ]
    },
    {
      category: 'System',
      notifications: [
        { id: 'system-maintenance', name: 'System Maintenance', description: 'Scheduled maintenance notifications', defaultEnabled: true },
        { id: 'backup-complete', name: 'Backup Complete', description: 'When system backup is completed', defaultEnabled: false },
        { id: 'security-alert', name: 'Security Alert', description: 'Important security notifications', defaultEnabled: true },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Configure email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={emailSettings.enabled}
              onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {emailSettings.enabled && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">Summary of daily activities</p>
                  </div>
                  <Switch
                    checked={emailSettings.dailyDigest}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, dailyDigest: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Report</Label>
                    <p className="text-sm text-muted-foreground">Weekly performance report</p>
                  </div>
                  <Switch
                    checked={emailSettings.weeklyReport}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, weeklyReport: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Product Updates</Label>
                    <p className="text-sm text-muted-foreground">New features and updates</p>
                  </div>
                  <Switch
                    checked={emailSettings.productUpdates}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, productUpdates: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Promotional content and offers</p>
                  </div>
                  <Switch
                    checked={emailSettings.marketingEmails}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, marketingEmails: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Important security notifications</p>
                  </div>
                  <Switch
                    checked={emailSettings.securityAlerts}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, securityAlerts: checked }))}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Configure mobile and desktop push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
            </div>
            <Switch
              checked={pushSettings.enabled}
              onCheckedChange={(checked) => setPushSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {pushSettings.enabled && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Messages</Label>
                    <p className="text-sm text-muted-foreground">When you receive new messages</p>
                  </div>
                  <Switch
                    checked={pushSettings.newMessages}
                    onCheckedChange={(checked) => setPushSettings(prev => ({ ...prev, newMessages: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders for pending tasks</p>
                  </div>
                  <Switch
                    checked={pushSettings.taskReminders}
                    onCheckedChange={(checked) => setPushSettings(prev => ({ ...prev, taskReminders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mentions</Label>
                    <p className="text-sm text-muted-foreground">When someone mentions you</p>
                  </div>
                  <Switch
                    checked={pushSettings.mentions}
                    onCheckedChange={(checked) => setPushSettings(prev => ({ ...prev, mentions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Updates</Label>
                    <p className="text-sm text-muted-foreground">System maintenance and updates</p>
                  </div>
                  <Switch
                    checked={pushSettings.systemUpdates}
                    onCheckedChange={(checked) => setPushSettings(prev => ({ ...prev, systemUpdates: checked }))}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Configure text message notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={smsSettings.enabled}
              onCheckedChange={(checked) => setSmsSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {smsSettings.enabled && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Critical Alerts</Label>
                    <p className="text-sm text-muted-foreground">Urgent and critical notifications</p>
                  </div>
                  <Switch
                    checked={smsSettings.criticalAlerts}
                    onCheckedChange={(checked) => setSmsSettings(prev => ({ ...prev, criticalAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Meeting and appointment reminders</p>
                  </div>
                  <Switch
                    checked={smsSettings.appointmentReminders}
                    onCheckedChange={(checked) => setSmsSettings(prev => ({ ...prev, appointmentReminders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Security-related notifications</p>
                  </div>
                  <Switch
                    checked={smsSettings.securityAlerts}
                    onCheckedChange={(checked) => setSmsSettings(prev => ({ ...prev, securityAlerts: checked }))}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
          <CardDescription>
            Configure application notification behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications within the application</p>
              </div>
              <Switch
                checked={inAppSettings.enabled}
                onCheckedChange={(checked) => setInAppSettings(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sound for notifications</p>
              </div>
              <Switch
                checked={inAppSettings.soundEnabled}
                onCheckedChange={(checked) => setInAppSettings(prev => ({ ...prev, soundEnabled: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Show desktop notifications</p>
              </div>
              <Switch
                checked={inAppSettings.desktopNotifications}
                onCheckedChange={(checked) => setInAppSettings(prev => ({ ...prev, desktopNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Badge Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notification badges</p>
              </div>
              <Switch
                checked={inAppSettings.badgeNotifications}
                onCheckedChange={(checked) => setInAppSettings(prev => ({ ...prev, badgeNotifications: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Notification Categories
          </CardTitle>
          <CardDescription>
            Configure notifications by category and type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((category) => (
            <div key={category.category} className="space-y-4">
              <h4 className="font-medium text-lg">{category.category}</h4>
              <div className="space-y-3">
                {category.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{notification.name}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {notification.defaultEnabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch defaultChecked={notification.defaultEnabled} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Notification Settings</Button>
      </div>
    </div>
  );
};
