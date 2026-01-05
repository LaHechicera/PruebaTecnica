export type NormalizedRecord = {
  sourceId: string;
  date: string; // YYYY-MM-DD
  category: string;
  amount: number;
  status: string;
  description?: string;
};
