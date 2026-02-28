export type TimeRange = "24h" | "7d" | "30d";

export interface MetricResponse {
  id: number;
  value: number;
}

export interface Metric {
  id: number;
  name: string;
  value: number;
}
