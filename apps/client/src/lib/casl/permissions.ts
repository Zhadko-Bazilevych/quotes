import { createContext } from 'react';

import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { createContextualCan } from '@casl/react';

import type { AppUser as User } from '@/types/auth';
import type { Quote } from '@/types/quote';

type Actions = 'manage' | 'read' | 'update' | 'delete' | 'create';
type Subjects = 'all' | User | 'User' | Quote | 'Quote';

type AppAbility = MongoAbility<[Actions, Subjects]>;

export const AbilityContext = createContext<AppAbility>({} as AppAbility);
export const Can = createContextualCan<AppAbility>(AbilityContext.Consumer);

export function defineAbilityFor(user?: User): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can('read', 'Quote');

  if (user) {
    can('manage', 'Quote', { userId: user.id });
  }

  return build();
}
