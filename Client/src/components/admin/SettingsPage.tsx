import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe, 
  Users,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    maintenance: true
  });

  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    autoBackup: true,
    maintenanceMode: false,
    registrationOpen: true
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    port: '587',
    username: 'admin@school.com',
    useSSL: true
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system configuration and preferences</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input id="schoolName" defaultValue="École Internationale Excellence" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schoolAddress">School Address</Label>
                  <Input id="schoolAddress" defaultValue="123 Education Street, Learning City" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input id="academicYear" defaultValue="2024-2025" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="GMT+1 (Central European Time)" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable dark theme for the interface</p>
                    </div>
                    <Switch 
                      checked={systemSettings.darkMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, darkMode: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Student Registration</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allow new student registrations</p>
                    </div>
                    <Switch 
                      checked={systemSettings.registrationOpen}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, registrationOpen: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>System Version</Label>
                    <p className="font-medium">ERP v2.1.0</p>
                  </div>
                  <div>
                    <Label>Database Version</Label>
                    <p className="font-medium">PostgreSQL 14.2</p>
                  </div>
                  <div>
                    <Label>Last Update</Label>
                    <p className="font-medium">2024-01-15</p>
                  </div>
                  <div>
                    <Label>Server Status</Label>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Storage Usage</Label>
                  <Progress value={68} className="w-full" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">6.8 GB of 10 GB used</p>
                </div>

                <div className="space-y-2">
                  <Label>Active Users</Label>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">2,847 Students, 186 Teachers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium">System Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Browser push notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Emergency SMS alerts</p>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Alerts</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">System maintenance notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.maintenance}
                      onCheckedChange={(checked) => setNotifications({...notifications, maintenance: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Templates</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="welcomeTemplate">Welcome Email Template</Label>
                    <Input id="welcomeTemplate" defaultValue="welcome_student.html" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gradeTemplate">Grade Notification Template</Label>
                    <Input id="gradeTemplate" defaultValue="grade_notification.html" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTemplate">Payment Reminder Template</Label>
                    <Input id="paymentTemplate" defaultValue="payment_reminder.html" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventTemplate">Event Notification Template</Label>
                    <Input id="eventTemplate" defaultValue="event_notification.html" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input id="passwordMinLength" type="number" defaultValue="8" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for admin accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Password Complexity</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Require special characters and numbers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Restrict admin access to specific IPs</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Successful admin login</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">admin@school.com - 2 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Failed login attempt</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">IP: 192.168.1.100 - 1 hour ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Password changed</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">teacher@school.com - 3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input 
                      id="smtpServer" 
                      value={emailSettings.smtpServer}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input 
                      id="smtpPort" 
                      value={emailSettings.port}
                      onChange={(e) => setEmailSettings({...emailSettings, port: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Username</Label>
                    <Input 
                      id="smtpUsername" 
                      value={emailSettings.username}
                      onChange={(e) => setEmailSettings({...emailSettings, username: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Password</Label>
                    <Input id="smtpPassword" type="password" placeholder="••••••••" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Use SSL/TLS</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable secure connection</p>
                    </div>
                    <Switch 
                      checked={emailSettings.useSSL}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, useSSL: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Test Email Configuration</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send a test email to verify settings</p>
                    <Input placeholder="test@example.com" />
                    <Button variant="outline" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Test Email
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Queue Status</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Operational
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">127 emails in queue</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Backup Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Backup</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily automatic backups</p>
                  </div>
                  <Switch 
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupTime">Backup Time</Label>
                  <Input id="backupTime" type="time" defaultValue="02:00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionDays">Retention Period (days)</Label>
                  <Input id="retentionDays" type="number" defaultValue="30" />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Create Manual Backup
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Restore from Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">backup_2024-01-20.sql</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Size: 2.3 GB</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">backup_2024-01-19.sql</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Size: 2.2 GB</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">backup_2024-01-18.sql</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Size: 2.1 GB</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5" />
                Maintenance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable to temporarily disable user access during updates
                  </p>
                </div>
                <Switch 
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                />
              </div>

              {systemSettings.maintenanceMode && (
                <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800 dark:text-red-400">
                      Maintenance Mode is Active
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Input 
                      id="maintenanceMessage" 
                      defaultValue="System is under maintenance. Please try again later."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Completion Time</Label>
                    <Input id="estimatedTime" type="datetime-local" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium">System Tasks</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Application Cache
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="mr-2 h-4 w-4" />
                    Optimize Database
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clean Temporary Files
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restart Application Server
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}