import { type AppUser } from 'src/auth/auth.types';
import { type AppAbility } from 'src/auth/permissions/permission.types';

import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export function defineAbilityFor(user: AppUser | null): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (user?.role.includes('admin')) {
    can('manage', 'all');
  }

  if (user?.role.includes('user')) {
    can('manage', 'Quote', { userId: user.id });
    can('manage', 'User', { id: user.id });
  }

  can('read', 'Quote', { visibility: 'public' });

  return build({
    detectSubjectType: (object) => object.__typename,
  });
}
