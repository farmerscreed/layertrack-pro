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

  const handleSaveSettings = async () => {
    try {
      // Save notification preferences to user profile
      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
          mobile_alerts: mobileAlerts
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      
      // Toggle dark mode
      document.documentElement.classList.toggle('dark', darkMode);
      localStorage.setItem('darkMode', String(darkMode));
      
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Error saving settings");
      console.error(error);
    }
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
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Settings
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage your account preferences and farm settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full gap-2 bg-transparent p-2">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="farm"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Farm Profile
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <AppearanceSettings darkMode={darkMode} setDarkMode={setDarkMode} />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
            mobileAlerts={mobileAlerts}
            setMobileAlerts={setMobileAlerts}
          />
        </TabsContent>

        <TabsContent value="farm" className="mt-6">
          <FarmSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
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