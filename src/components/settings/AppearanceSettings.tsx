import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CNY", label: "Chinese Yuan (¥)" },
  { value: "ZAR", label: "South African Rand (R)" },
];

interface AppearanceSettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function AppearanceSettings({ darkMode, setDarkMode }: AppearanceSettingsProps) {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const loadCurrencyPreference = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('currency_preference')
        .eq('id', user.id)
        .single();

      if (profile?.currency_preference) {
        setCurrency(profile.currency_preference);
      }
    };

    loadCurrencyPreference();
  }, []);

  const handleCurrencyChange = async (value: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({ currency_preference: value })
        .eq('id', user.id);

      if (error) throw error;

      setCurrency(value);
      toast.success("Currency preference updated");
    } catch (error) {
      console.error('Error updating currency:', error);
      toast.error("Failed to update currency preference");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
          <Label htmlFor="dark-mode" className="text-sm text-muted-foreground">
            Enable dark mode
          </Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="currency">Currency</Label>
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Choose your preferred currency for displaying monetary values
        </p>
      </div>
    </div>
  );
}