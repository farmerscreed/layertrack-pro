import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { FarmSettings } from "@/components/settings/FarmSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

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

        <TabsContent value="general">
          <AppearanceSettings darkMode={darkMode} setDarkMode={setDarkMode} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
            mobileAlerts={mobileAlerts}
            setMobileAlerts={setMobileAlerts}
          />
        </TabsContent>

        <TabsContent value="farm">
          <FarmSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
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