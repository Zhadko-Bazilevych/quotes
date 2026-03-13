import z from 'zod';

export const visibilitySchema = z.enum(['public', 'private']);

export type Visibility = z.infer<typeof visibilitySchema>;
