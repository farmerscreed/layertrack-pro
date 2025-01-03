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
    const symbol = currencySymbols[currency] || "$";
    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}