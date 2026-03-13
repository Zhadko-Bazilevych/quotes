import { visibilitySchema } from 'src/quote/dto/visibility.dto';
import { userIdValueSchema } from 'src/user/dto/user-id.dto';
import z from 'zod';

export const updateQuoteSchema = z.object({
  author: z.string().trim().min(3).max(30).optional(),
  content: z.string().trim().min(3).max(500).optional(),
  userId: userIdValueSchema.optional(),
  context: z.string().trim().max(500).optional(),
  visibility: visibilitySchema.optional(),
});

export type UpdateQuoteDto = z.infer<typeof updateQuoteSchema>;
