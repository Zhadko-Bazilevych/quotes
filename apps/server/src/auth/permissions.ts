import { type AppUser } from 'src/auth/auth.types';
import { type Quote } from 'src/quote/domain/quote';

import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';

type Actions = 'manage' | 'read' | 'update' | 'delete' | 'create';
type Subjects = 'all' | Quote | 'Quote' | AppUser | 'User';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(_user: AppUser | null): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can('manage', 'all');

  return build({
    detectSubjectType: (object) => object.__typename,
  });
}
