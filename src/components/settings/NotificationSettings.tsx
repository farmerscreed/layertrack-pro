import { Bell, Mail, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  mobileAlerts: boolean;
  setMobileAlerts: (value: boolean) => void;
}

export const NotificationSettings = ({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  mobileAlerts,
  setMobileAlerts,
}: NotificationSettingsProps) => {
  return (
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
  );
};