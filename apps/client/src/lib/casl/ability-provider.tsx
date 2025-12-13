import { type JSX, useMemo } from 'react';

import { useSession } from '@/hooks/use-session';
import { AbilityContext, defineAbilityFor } from '@/lib/casl/permissions';

export function AbilityProvider({
  children,
}: React.PropsWithChildren): JSX.Element {
  const { data } = useSession();

  const ability = useMemo(() => {
    return defineAbilityFor(data?.user);
  }, [data?.user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
