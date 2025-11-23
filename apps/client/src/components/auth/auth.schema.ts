import z from 'zod';

export const loginSchema = z.object({
  email: z.email().min(1, { error: 'The field is required' }),
  password: z.string().min(1, { error: 'The field is required' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
