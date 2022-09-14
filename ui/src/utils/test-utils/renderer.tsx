// Based on https://testing-library.com/docs/react-testing-library/setup#custom-render

import { MockedProvider } from '@apollo/client/testing';
import { render, RenderOptions } from '@testing-library/react'; // eslint-disable-line import/no-extraneous-dependencies
import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ReduxProvider } from '../../redux';

const AllTheProviders: FC = ({ children }) => {
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
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';
// override render method
export { customRender as render };
