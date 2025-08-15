// Based on https://testing-library.com/docs/react-testing-library/setup#custom-render

import { MockedProvider } from '@apollo/client/testing';
import { RenderOptions, render } from '@testing-library/react';
import { FC, PropsWithChildren, ReactElement } from 'react';
import { BrowserRouter } from 'react-router';
import { ReduxProvider } from '../../redux';
// Make sure I18Next is initialized
import '../../i18n';

const AllTheProviders: FC<PropsWithChildren> = ({ children }) => {
  // Add "providers" or "wrappers" that are needed in all DOM render tests here
  return (
    <MockedProvider addTypename={false}>
      <ReduxProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ReduxProvider>
    </MockedProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
