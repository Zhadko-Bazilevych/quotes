import { type UserId } from 'src/database/tables/user.tables';
import { newIdValueSchema } from 'src/utils/dto/id.dto';
import type z from 'zod';

export const userIdValueSchema = newIdValueSchema<UserId>();

export type UserIdDto = z.infer<typeof userIdValueSchema>;
