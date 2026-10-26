import type { CyHttpMessages, Interception } from 'cypress/types/net-stubbing';
import { debug } from './templateStringHelpers';
import { TIME_ZONE } from './time';

class CustomAssertionError extends Error {}

const HAS_TIME = /T/;
const HAS_OFFSET = /T.*([zZ]|[+-]\d{2}(:?\d{2})?)$/;

// Cypress has a bug, and it does not export the expect.fail() function.
// This is a custom implementation.
function fail(message: string) {
  throw new CustomAssertionError(message);
}

/**
 * Simplified GraphQL type.
 * All fields are optional, to support all possible implementations,
 * that might cater to different version/interpretation of the spec.
 */
export type GraphQLBody<
  DataT extends Record<string, unknown> = Record<string, unknown>,
  ExtensionsT extends Record<string, unknown> = Record<string, unknown>,
  ErrorTypes = unknown,
> = {
  readonly data?: DataT | null;
  readonly extensions?: ExtensionsT;
  readonly errors?: ReadonlyArray<ErrorTypes>;
};

export type SuccessfulGraphQLInterception<
  RequestT = unknown,
  BodyT extends GraphQLBody = GraphQLBody,
> = Readonly<Omit<Interception<RequestT>, 'error' | 'response'>> & {
  readonly response: CyHttpMessages.IncomingRequest<BodyT>;
};

function assertResponseIsDefined<TBody>(
  alias: string,
  response: CyHttpMessages.IncomingResponse<TBody> | undefined | null,
): asserts response is CyHttpMessages.IncomingResponse<TBody> {
  expect(response).to.be.an('object', `${alias}: Response should be defined!`);
}

function assertBodyIsObject(
  alias: string,
  body: unknown,
): asserts body is object {
  expect(body).to.be.an(
    'object',
    `${alias}: Response body should be an Object!`,
  );
}

function assertBodyIsAGraphQlResponse(
  alias: string,
  body: object,
): asserts body is GraphQLBody {
  if ('data' in body) {
    if (typeof body.data !== 'object') {
      fail(
        debug`${alias}: 'data' field of the ResponseBody must be a JSON object or null!: Body:\n${body}`,
      );
    }
  }

  if ('extensions' in body) {
    if (typeof body.extensions !== 'object') {
      fail(
        debug`${alias}: 'extensions' field of the ResponseBody must be a JSON object or null!: Body:\n${body}`,
      );
    }
  }

  if ('errors' in body) {
    if (!(body.errors === null || Array.isArray(body.errors))) {
      fail(
        debug`${alias}: 'errors' field of the ResponseBody must be a JSON array or null!: Body:\n${body}`,
      );
    }
  }
}

function assertGraphQLBodyHasNoErrors(alias: string, body: GraphQLBody) {
  if (body.errors?.length) {
    fail(
      debug`${alias}: There should be no errors in the response! Body:\n${body}`,
    );
  }
}

function assertGraphQlBodyHasErrors(
  alias: string,
  body: GraphQLBody,
): asserts body is GraphQLBody {
  if (!body.errors?.length) {
    fail(
      debug`${alias}: There should be errors in the response! Body:\n${body}`,
    );
  }
}

function assertAndGetValidGraphGLBody(
  alias: string,
  interceptedCall: Interception<unknown, unknown>,
): GraphQLBody {
  const { error, response } = interceptedCall;

  expect(error).to.be.an(
    'undefined',
    `${alias}: Intercepted call should not have raw network error!`,
  );

  assertResponseIsDefined(alias, response);

  const { body, statusCode } = response;
  expect(statusCode).to.eq(
    200,
    `${alias}: A successful response should have status code of 200!`,
  );
  assertBodyIsObject(alias, body);
  assertBodyIsAGraphQlResponse(alias, body);

  return body;
}

export function expectGraphQLCallToSucceed(alias: `@${string}`) {
  return cy
    .wait(alias)
    .then((interceptedCall): SuccessfulGraphQLInterception => {
      const body = assertAndGetValidGraphGLBody(alias, interceptedCall);
      assertGraphQLBodyHasNoErrors(alias, body);

      return interceptedCall as unknown as SuccessfulGraphQLInterception;
    });
}

/**
 * Like expectGraphQLCallToSucceed, but skips intercepted calls that have a raw
 * network error (e.g. socket closed mid-response due to rapid re-querying).
 * Useful when typing into a search field triggers multiple debounced requests
 * and intermediate requests may get cancelled in CI.
 */
export function waitForSuccessfulGraphQLCall(
  alias: `@${string}`,
): Cypress.Chainable<SuccessfulGraphQLInterception> {
  return cy
    .wait(alias)
    .then(
      (interceptedCall): Cypress.Chainable<SuccessfulGraphQLInterception> => {
        if (interceptedCall.error) {
          return waitForSuccessfulGraphQLCall(alias);
        }
        const body = assertAndGetValidGraphGLBody(alias, interceptedCall);
        assertGraphQLBodyHasNoErrors(alias, body);
        return cy.wrap(
          interceptedCall as unknown as SuccessfulGraphQLInterception,
        );
      },
    );
}

export function expectGraphQLCallToReturnError(alias: `@${string}`) {
  return cy
    .wait(alias)
    .then((interceptedCall): SuccessfulGraphQLInterception => {
      const body = assertAndGetValidGraphGLBody(alias, interceptedCall);
      assertGraphQlBodyHasErrors(alias, body);

      return interceptedCall as unknown as SuccessfulGraphQLInterception;
    });
}

// Either returns or throws with fail
function extractHelsinkiDate(timeyValue: unknown): string {
  if (timeyValue instanceof Temporal.PlainDate) {
    return timeyValue.toString();
  }

  if (timeyValue instanceof Temporal.ZonedDateTime) {
    return timeyValue.withTimeZone(TIME_ZONE).toPlainDate().toString();
  }

  try {
    const value = timeyValue as string;

    // Date only values are already Helsinki dates, other values are moments in
    // time that have to be converted to the Helsinki time zone first. Values
    // without an offset are assumed to be in UTC.
    if (!HAS_TIME.test(value)) {
      return Temporal.PlainDate.from(value).toString();
    }

    return Temporal.Instant.from(HAS_OFFSET.test(value) ? value : `${value}Z`)
      .toZonedDateTimeISO(TIME_ZONE)
      .toPlainDate()
      .toString();
  } catch (e) {
    const message = e instanceof Error ? e.message : e;
    throw new CustomAssertionError(
      debug`Value (${timeyValue}) is not a valid date string. Parse error: ${message}`,
    );
  }
}

function extractHelsinkiDateFromTimeyValue(
  timeyValue: unknown,
): string | undefined | null {
  if (timeyValue === undefined || timeyValue === null) {
    return timeyValue;
  }

  return extractHelsinkiDate(timeyValue);
}

export function expectDateTimeyValuesToBeSameHelsinkiDateOrNullish(
  actual: unknown,
  expected: unknown,
) {
  const actualDate = extractHelsinkiDateFromTimeyValue(actual);
  const expectedDate = extractHelsinkiDateFromTimeyValue(expected);

  expect(actualDate).to.eq(expectedDate);
}
