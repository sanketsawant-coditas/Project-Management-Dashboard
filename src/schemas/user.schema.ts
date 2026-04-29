import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short').optional(),
  role: z.enum(['user', 'admin', 'super-admin']),
  isActive: z.boolean().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;