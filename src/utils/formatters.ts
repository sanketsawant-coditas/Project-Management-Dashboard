export const formatStatus = (status: string): string => {
  const map: Record<string, string> = {
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    planning: 'Planning',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
};

export const formatPriority = (priority: string): string => {
  const map: Record<string, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    urgent: 'Urgent',
  };
  return map[priority] || priority;
};

export const statusColor: Record<string, string> = {
    planning: 'default',
    in_progress: 'warning',
    on_hold: 'default',
    completed: 'success',
    cancelled: 'danger',
} as const;

export const priorityColor: Record<string, string> = {
    low: 'default',
    medium: 'default',
    high: 'warning',
    urgent: 'danger',
  } as const;


