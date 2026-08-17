// Can be used to provide context for react hooks in integration tests

import { ReactNode } from 'react';
import { ApolloProvider } from '../../../components/common/Apollo';

// https://react-hooks-testing-library.com/usage/advanced-hooks
export function hookWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider>{children}</ApolloProvider>;
}

// default options for `renderHook` method from `@testing-library/react`
// to be used in integration tests
export const renderOptions = { wrapper: hookWrapper };
