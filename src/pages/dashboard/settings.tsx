import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Building2, 
  Globe, 
  Mail, 
  Moon, 
  Palette, 
  Shield, 
  Sun, 
  User,
  Smartphone
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [mobileAlerts, setMobileAlerts] = useState(true);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and farm settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="farm">Farm Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the dashboard looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme Preference</Label>
                  <div className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-orange-400" />
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Moon className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your preferred language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input defaultValue="English (US)" />
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Input defaultValue="(UTC-05:00) Eastern Time (US & Canada)" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <Label>Email Notifications</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Receive daily reports and alerts via email
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <Label>Push Notifications</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Get instant updates in your browser
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <Label>Mobile Alerts</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Receive critical alerts on your mobile device
                  </div>
                </div>
                <Switch
                  checked={mobileAlerts}
                  onCheckedChange={setMobileAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farm" className="space-y-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Farm Information
              </CardTitle>
              <CardDescription>
                Update your farm's profile and business details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Farm Name</Label>
                  <Input placeholder="Enter your farm's name" />
                </div>
                <div className="space-y-2">
                  <Label>Business Registration</Label>
                  <Input placeholder="Registration number" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Farm location" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
        <Button onClick={handleSaveSettings}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;