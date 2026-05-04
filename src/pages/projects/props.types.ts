import type { Project } from "@/types/project.types";

export interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess?: (newProject: Project) => void;
}

export interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onSuccess?: (newProject: Project) => void;
  onEdit: () => void;
  canEdit: boolean;
  onUpdate?: (updatedProject: Project) => void;
}

export const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    in_progress: "In Progress",
    on_hold: "On Hold",
    planning: "Planning",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[status] || status;
};

export const formatPriority = (priority: string) => {
  const map: Record<string, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
    urgent: "Urgent",
  };
  return map[priority] || priority;
};
