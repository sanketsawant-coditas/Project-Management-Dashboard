import z from "zod";


export const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  progress: z.number().min(0).max(100).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  technologies: z.string().optional(), 
});

export type FormData = z.infer<typeof projectSchema>;