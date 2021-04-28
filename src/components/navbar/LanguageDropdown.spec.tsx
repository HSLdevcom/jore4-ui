import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { render } from 'test-utils';
import { LanguageDropdown, testIds } from './LanguageDropdown';

describe('<LanguageDropdown />: Example interactive test', () => {
  const finnishTitle = 'FI';
  const englishTitle = 'EN';
  // Example tes suite. Maybe not the most useful test to have, but this
  // shows how to fire UI events and test user interactions.
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
});
