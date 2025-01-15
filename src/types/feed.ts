export interface FeedInventory {
  id: string;
  user_id: string;
  feed_type: string;
  quantity_kg: number;
  purchase_date: string;
  cost_per_kg: number | null;
  supplier: string | null;
  notes: string | null;
  created_at: string;
}

export interface FeedFormData {
  quantity: number;
  type: string;
  supplier: string;
  cost: number;
  date: string;
}