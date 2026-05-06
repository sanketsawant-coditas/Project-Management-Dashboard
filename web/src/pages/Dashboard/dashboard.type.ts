export interface Statistics {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  upcomingDeadlines: Array<{ id: string; name: string; endDate: string }>;
}
