// Can be used to provide context for react hooks in integration tests

import { ReactElement } from 'react';
import { ApolloProvider } from '../../../graphql';

// https://react-hooks-testing-library.com/usage/advanced-hooks
export const hookWrapper = ({ children }: { children: ReactElement }) => (
  <ApolloProvider>{children}</ApolloProvider>
);

// default options for `renderHook` method from `@testing-library/react`
// to be used in integration tests
export const renderOptions = { wrapper: hookWrapper };
