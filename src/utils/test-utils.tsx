// Based on https://testing-library.com/docs/react-testing-library/setup#custom-render

import { render, RenderOptions } from '@testing-library/react'; // eslint-disable-line import/no-extraneous-dependencies
import React, { FunctionComponent } from 'react';

const AllTheProviders: FunctionComponent = ({ children }) => {
  // Add "providers" or "wrappers" that are needed in all DOM render tests here
  return <>{children}</>;
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

export const sleep = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

// mock the current date to be static
Date.now = jest.fn(() => 1487076708000);
