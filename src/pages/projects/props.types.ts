import type { Project } from "@/types/project.types";

export interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess?: (newProject: Project) => void;
}

export interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
  canEdit: boolean;
}