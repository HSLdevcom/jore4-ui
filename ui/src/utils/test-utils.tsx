// Based on https://testing-library.com/docs/react-testing-library/setup#custom-render

import { MockedProvider } from '@apollo/client/testing';
import { render, RenderOptions } from '@testing-library/react'; // eslint-disable-line import/no-extraneous-dependencies
import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ReduxProvider } from '../redux';

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

export const sleep = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

// mock the current date to be static
Date.now = jest.fn(() => 1487076708000);

export const buildLocalizedString = (str: string) => ({
  fi_FI: str,
  sv_FI: `${str} SV`,
});

export const buildRoute = (postfix: string) => ({
  label: `route ${postfix}`,
  name_i18n: buildLocalizedString(`route ${postfix}`),
  description_i18n: buildLocalizedString(`description ${postfix}`),
  origin_name_i18n: buildLocalizedString(`origin ${postfix}`),
  origin_short_name_i18n: buildLocalizedString(`origin short ${postfix}`),
  destination_name_i18n: buildLocalizedString(`destination ${postfix}`),
  destination_short_name_i18n: buildLocalizedString(
    `destination short ${postfix}`,
  ),
});
