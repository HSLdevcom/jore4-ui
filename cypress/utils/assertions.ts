/* eslint-disable jest/valid-expect,no-unused-expressions */

import type { CyHttpMessages } from 'cypress/types/net-stubbing';

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

function assertBodyIsAnErrorFreeGraphQlResponse(alias: string, body: object) {
  if ('errors' in body) {
    const bodyAsJson = JSON.stringify(body, null, 2);

    expect(
      body.errors,
      `${alias}: There should be no errors in the response! Body:\n${bodyAsJson}\n`,
    ).to.be.an('array').that.is.empty;
  }
}

export function expectGraphQLCallToSucceed(alias: string) {
  return cy.wait(alias).then((interceptedCall) => {
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

    return interceptedCall;
  });
}
