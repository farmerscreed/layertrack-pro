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

export interface FeedConsumption {
  id: string;
  user_id: string;
  feed_inventory_id: string;
  batch_id: string;
  quantity_kg: number;
  consumption_date: string;
  notes: string | null;
  created_at: string;
  batches?: {
    name: string;
  };
}