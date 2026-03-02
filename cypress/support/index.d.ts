// load type definitions that come with Cypress module
/// <reference types="cypress" />

// load type definitions for Luxon
/// <reference types="@types/luxon" />

declare namespace Cypress {
  import type { DateTime } from 'luxon';
  import type {
    InsertQuaysResult,
    InsertQuaysWithRealIdsParams,
    ReadDownloadedCSVOptions,
  } from './types';

  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('exampleTestid')
     */
    getByTestId(value: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.findByTestId('exampleTestid')
     * Difference of "get" vs "find" is explained in cypress docs:
     * https://docs.cypress.io/api/commands/get#Get-vs-Find
     */
    findByTestId(value: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to clear an input field and type the value
     */
    clearAndType(value: string): Chainable<JQuery<HtmlElement>>;

    /**
     * Custom command to clear an input field and type the date
     */
    inputDateValue(value: DateTime): Chainable<JQuery<HtmlElement>>;

    /**
     * Custom command to scroll the element into view and then click it.
     */
    scrollIntoViewAndClick(): Chainable<void>;

    /**
     * Custom command to check if element has text
     */
    shouldHaveText(value: string): Chainable<JQuery<HtmlElement>>;

    /**
     * Custom command to check if element is visible
     */
    shouldBeVisible(): Chainable<JQuery<HtmlElement>>;

    /**
     * Custom command to check if element is disabled
     */
    shouldBeDisabled(): Chainable<JQuery<HtmlElement>>;

    /**
     * Closes active dropdown. (Presses escape)
     */
    closeDropdown(): Chainable<void>;

    /**
     * Grab and alias the body element, so we can perform actions
     * within in it, even when withing other alternative within calls.
     */
    aliasBody(): Chainable<void>;

    /**
     * Perform actions within the Headless UI portal
     * @param fn
     */
    withinHeadlessPortal(
      fn: (currentSubject: Subject) => void,
    ): Chainable<Subject>;

    /**
     * Print a message with a formatted style
     * @param {Object} log - The message to be printed.
     * @param {string} log.title - The title of the message.
     * @param {string} log.message - The content of the message.
     * @param {('info' | 'warning' | 'error' | 'success' | 'section')} log.type - The type of the message.
     *
     * @example
     * // Print a message with a formatted style e.g. success
     * cy.print({ title: 'foo', message: 'bar', type: 'success' })
     */
    print(log: {
      readonly title: string;
      readonly message: string;
      readonly type: 'info' | 'warning' | 'error' | 'success' | 'section';
    }): void;

    /**
     * Print message in the given style.
     * @param message message to log.
     * @param title optional title block, defaults to INFO.
     */
    info(message: string, title: string = 'INFO'): void;

    /**
     * Print message in the given style.
     * @param message message to log.
     * @param title optional title block, defaults to WARNING.
     */
    warning(message: string, title: string = 'WARNING'): void;

    /**
     * Print message in the given style.
     * @param message message to log.
     * @param title optional title block, defaults to ERROR.
     */
    error(message: string, title: string = 'ERROR'): void;

    /**
     * Print message in the given style.
     * @param message message to log.
     * @param title optional title block, defaults to SUCCESS.
     */
    success(message: string, title: string = 'SUCCESS'): void;

    /**
     * Allows groping command to smaller sections within complex tests.
     *
     * @param description Description/name of the test-block
     * @param commands Any and all actual Cypress test logic goes in here
     */
    section(description: string, commands: () => void): void;

    /**
     * Mimics admin login by mocking auth backend response and authenticating
     * graphql calls with secret admin headers.
     * Does not support logging it with given credentials or roles so far.
     * @example cy.mockLogin()
     */
    mockLogin(): Chainable<void>;

    /**
     * Sets up default configurations for every test.
     * @example cy.setupTests()
     */
    setupTests(): Chainable<void>;

    /**
     * Inserts the specified quays into the DB with real proper generated
     * public and private codes.
     *
     * @param event task id 'insertQuaysWithRealIds'
     * @param params quays to insert and whether to generate the ids in parallel or sequentially
     */
    task<Tags extends string>(
      event: 'insertQuaysWithRealIds',
      params: InsertQuaysWithRealIdsParams<Tags>,
    ): Chainable<InsertQuaysResult<Tags>>;

    /**
     * Lookup a download CSV file that might be found under multiple names.
     * Loads the 1st found file.
     *
     * @param event task id 'readDownloadedCSV'
     * @param options options
     */
    task(
      event: 'readDownloadedCSV',
      options: ReadDownloadedCSVOptions,
    ): Chainable<string>;
  }
}

declare namespace luxon {
  interface TSSettings {
    throwOnInvalid: true;
  }
}
