import { createContext } from 'react';

import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import { createContextualCan } from '@casl/react';

import type { AppUser, AppUser as User } from '@/types/auth';
import type { Quote } from '@/types/quote';

type Actions = 'manage' | 'read' | 'update' | 'delete' | 'create';
type Subjects = 'all' | Quote | 'Quote' | AppUser | 'User';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const AbilityContext = createContext<AppAbility>({} as AppAbility);
export const Can = createContextualCan<AppAbility>(AbilityContext.Consumer);

export function defineAbilityFor(user?: User): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (user?.role.includes('admin')) {
    can('manage', 'all');
  }

  if (user?.role.includes('user')) {
    can('manage', 'Quote', { userId: user.id });
    can('manage', 'User', { id: user.id });
  }

  return build({
    detectSubjectType: (object) => object.__typename,
  });
}
