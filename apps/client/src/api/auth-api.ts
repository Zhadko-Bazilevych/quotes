import { authClient } from '@/lib/auth-client';

type SignInWithEmailVariablesArray = Parameters<typeof authClient.signIn.email>;

export type SignInWithEmailVariables = {
  data: SignInWithEmailVariablesArray[0];
  options: SignInWithEmailVariablesArray[1];
};

export type SignOutVariables = Parameters<typeof authClient.signOut>[0];

export class AuthApi {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  signInWithEmail({ data, options }: SignInWithEmailVariables) {
    return authClient.signIn.email(data, options);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  signOut(data: SignOutVariables) {
    return authClient.signOut(data);
  }
}
