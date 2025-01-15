export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  category: string;
  amount: number;
  unit_cost?: number;
  quantity?: number;
  description?: string;
  payment_method?: string;
  created_at: string;
}

export interface TransactionFormData {
  date: string;
  type: "income" | "expense";
  category: string;
  unitCost: number;
  quantity: number;
  description: string;
  paymentMethod: "cash" | "bank" | "mobile";
}