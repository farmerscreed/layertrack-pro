import { Moon, Palette, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AppearanceSettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const AppearanceSettings = ({ darkMode, setDarkMode }: AppearanceSettingsProps) => {
  return (
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
  );
};