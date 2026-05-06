import api from "@/api/axios";
import type { Statistics } from "@/pages/Dashboard/dashboard.type";

export const dashService = {
  getStatistics: () => api.get<Statistics>("/projects/statistics"),
  getAssignedProjects: () => api.get("/projects?limit=100"),
};
