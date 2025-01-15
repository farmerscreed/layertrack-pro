import { Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const FarmSettings = () => {
  const [loading, setLoading] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const loadFarmSettings = async () => {
      try {
        setLoading(true);
        const { data: farmSettings, error } = await supabase
          .from("farm_settings")
          .select("*")
          .single();

        if (error) throw error;

        if (farmSettings) {
          setFarmName(farmSettings.farm_name);
          setRegistrationNumber(farmSettings.registration_number || "");
          setAddress(farmSettings.address || "");
        }
      } catch (error) {
        console.error("Error loading farm settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFarmSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const { data: existingSettings } = await supabase
        .from("farm_settings")
        .select("id")
        .single();

      if (existingSettings) {
        // Update existing settings
        const { error } = await supabase
          .from("farm_settings")
          .update({
            farm_name: farmName,
            registration_number: registrationNumber,
            address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSettings.id);

        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from("farm_settings")
          .insert({
            user_id: user.id,
            farm_name: farmName,
            registration_number: registrationNumber,
            address,
          });

        if (error) throw error;
      }

      toast.success("Farm settings saved successfully");
    } catch (error) {
      console.error("Error saving farm settings:", error);
      toast.error("Failed to save farm settings");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                placeholder="Enter your farm's name"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Business Registration</Label>
              <Input
                id="registrationNumber"
                placeholder="Registration number"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Farm location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};