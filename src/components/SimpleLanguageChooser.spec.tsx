import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { render } from 'test-utils';
import { SimpleLanguageChooser, testIds } from './SimpleLanguageChooser';

describe('<SimpleLanguageChooser />: Example interactive test', () => {
  const finnishTitle = 'Sovelluksen kieli';
  const englishTitle = "Choose app's language";
  // Example test. Maybe not the most useful test to have, but this
  // shows how to fire UI events and test interactions.
  test("Changes app's language when requested", async () => {
    render(<SimpleLanguageChooser />);
    const changeLanguageButton = screen.getByTestId(
      testIds.changeLanguageButton,
    );
    expect(screen.queryByText(finnishTitle)).toBeVisible();
    expect(screen.queryByText(englishTitle)).toBeNull();
    fireEvent.click(changeLanguageButton);
    expect(screen.queryByText(englishTitle)).toBeVisible();
    expect(screen.queryByText(finnishTitle)).toBeNull();
  });
});
