import { Tag } from '../enums';

describe('Login tests', () => {
  beforeEach(() => {
    cy.setupTests();
  });

  it(
    'User is not logged in by default',
    { tags: [Tag.Login, Tag.Smoke] },
    () => {
      cy.visit('/');
      // If login button is visible, user is logged out
      cy.getByTestId('UserNavMenu::loginButton');
    },
  );
});
