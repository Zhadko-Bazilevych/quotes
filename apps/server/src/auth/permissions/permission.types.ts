import { type AppUser } from 'src/auth/auth.types';
import { type Quote } from 'src/quote/domain/quote';

import { type MongoAbility } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'update' | 'delete' | 'create';
export type Subjects = 'all' | Quote | 'Quote' | AppUser | 'User';

export type AppAbility = MongoAbility<[Actions, Subjects]>;
