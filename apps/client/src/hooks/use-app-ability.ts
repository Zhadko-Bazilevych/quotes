import { useAbility } from '@casl/react';

import { AbilityContext, type AppAbility } from '@/lib/casl/permissions';

export const useAppAbility = (): AppAbility => {
  return useAbility(AbilityContext);
};
