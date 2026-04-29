export interface ProjectMember {
  userId: string;
  userName: string;
  userRole: string;
  projectRole: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  ownerName: string;
  members: ProjectMember[];
  startDate: string;
  endDate?: string;
  technologies?: string[];
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
}