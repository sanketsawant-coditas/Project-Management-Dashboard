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