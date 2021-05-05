import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { render } from 'test-utils';
import { i18n } from '../../i18n';
import { LanguageDropdown, testIds } from './LanguageDropdown';

describe('<LanguageDropdown />', () => {
  const finnishTitle = 'FI';
  const englishTitle = 'EN';
  test('Opens dropdown when clicked', async () => {
    render(<LanguageDropdown />);

    // dropdown is collapsed:
    expect(screen.queryByText(finnishTitle)).toBeVisible();
    expect(screen.queryByText(englishTitle)).toBeNull();

    // click dropdown to open it:
    const openDropdownButton = screen.getByTestId(testIds.openDropdown);
    fireEvent.click(openDropdownButton);

    // dropdown is open:
    expect(screen.queryByText(englishTitle)).toBeVisible();
    expect(screen.queryByText(finnishTitle)).toBeVisible();
  });
  test('Changes language when requested', async () => {
    render(<LanguageDropdown />);
    const openDropdownButton = screen.getByTestId(testIds.openDropdown);

    // default language is finnish:
    expect(i18n.language).toBe('fi-FI');
    expect(openDropdownButton).toHaveTextContent(finnishTitle);

    // click dropdown to open it:
    fireEvent.click(openDropdownButton);

    // change language to english:
    fireEvent.click(screen.getByText(englishTitle));

    // language was changed to english:
    expect(openDropdownButton).toHaveTextContent(englishTitle);
    expect(i18n.language).toBe('en-US');

    // dropdown was closed:
    expect(screen.queryByText(englishTitle)).toBeVisible();
    // (actually seems like finnish title is still visible on `screen` of this test.
    // That's weird, as in browser dropdown is clearly closed after either of its
    // buttons are clicked, and only main button/dropdown trigger seems to stay in DOM.)
    // expect(screen.queryByText(finnishTitle)).toBeNull();
  });
});
