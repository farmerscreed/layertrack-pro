import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type CurrencyContextType = {
  currency: string;
  formatCurrency: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  formatCurrency: (amount) => `$${amount.toFixed(2)}`,
});

export const useCurrency = () => useContext(CurrencyContext);

const currencySymbols: Record<string, string> = {
  USD: "$",
  NGN: "₦",
  GBP: "£",
  EUR: "€",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  JPY: "¥",
  CNY: "¥",
  ZAR: "R",
};

const currencyRates: Record<string, number> = {
  USD: 1,
  NGN: 1550, // Example rate (1 USD = 1550 NGN)
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.35,
  AUD: 1.52,
  INR: 82.85,
  JPY: 150.35,
  CNY: 7.19,
  ZAR: 18.95,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
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

    // Subscribe to realtime changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`,
        },
        (payload) => {
          const newCurrency = payload.new.currency_preference;
          if (newCurrency) {
            setCurrency(newCurrency);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    // Convert amount from USD to selected currency
    const convertedAmount = amount * currencyRates[currency];
    
    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
    }).format(convertedAmount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}