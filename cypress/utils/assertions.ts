/* eslint-disable jest/valid-expect */

import type { CyHttpMessages, Interception } from 'cypress/types/net-stubbing';
import { DateTime } from 'luxon';
import { debug } from './templateStringHelpers';

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

function assertBodyIsAnErrorFreeGraphQlResponse(
  alias: string,
  body: object,
): asserts body is GraphQLBody {
  if ('data' in body) {
    if (typeof body.data !== 'object') {
      expect.fail(
        debug`${alias}: 'data' field of the ResponseBody must be a JSON object or null!: Body:\n${body}`,
      );
    }
  }

  if ('extensions' in body) {
    if (typeof body.extensions !== 'object') {
      expect.fail(
        debug`${alias}: 'extensions' field of the ResponseBody must be a JSON object or null!: Body:\n${body}`,
      );
    }
  }

  if ('errors' in body) {
    if (body.errors !== null || !Array.isArray(body.errors)) {
      expect.fail(
        debug`${alias}: 'extensions' field of the ResponseBody must be a JSON array or null!: Body:\n${body}`,
      );
    }

    if ((body.errors as Array<unknown>).length) {
      expect.fail(
        debug`${alias}: There should be no errors in the response! Body:\n${body}`,
      );
    }
  }
}

export function expectGraphQLCallToSucceed(alias: string) {
  return cy
    .wait(alias)
    .then((interceptedCall): SuccessfulGraphQLInterception => {
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
      assertBodyIsAnErrorFreeGraphQlResponse(alias, body);

      return interceptedCall as unknown as SuccessfulGraphQLInterception;
    });
}

// Either returns or throws with expect.fail
// eslint-disable-next-line consistent-return
function parseDate(timeyValue: unknown): DateTime {
  if (DateTime.isDateTime(timeyValue)) {
    return timeyValue;
  }

  // Luxon has been set up to throw on invalid date times.
  try {
    return DateTime.fromISO(timeyValue as string);
  } catch (e) {
    const message = e instanceof Error ? e.message : e;
    expect.fail(
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

  return parseDate(timeyValue).setZone('Europe/Helsinki').toISODate();
}

export function expectDateTimeyValuesToBeSameHelsinkiDateOrNullish(
  actual: unknown,
  expected: unknown,
) {
  const actualDate = extractHelsinkiDateFromTimeyValue(actual);
  const expectedDate = extractHelsinkiDateFromTimeyValue(expected);

  expect(actualDate).to.eq(expectedDate);
}
