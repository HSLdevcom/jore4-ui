import { ApolloError } from '@apollo/client';

/** This will get the actual error message from ApolloError.
 * There are three different types of errors: network error,
 * graphQLError and client error. Returned message corresponds
 * to the type of the message. If there are multiple error messages,
 * they will be all included.
 */
export const getApolloErrorMessage = (err: ApolloError) => {
  if (err.graphQLErrors.length) {
    const errorMessages = err.graphQLErrors.map((gqlError) => {
      // If it is an internal error, we get the message from internal object
      // otherwise it is in the message field.
      // @ts-expect-error "Property 'error' does not exist on type '{}"
      // Typings seems to be somehow off, this seems still be the way to
      // receive internal error message.
      return gqlError.extensions?.internal?.error?.message || gqlError.message;
    });

    return `GraphQL errors: ${errorMessages.join(' | ')}`;
  }

  if (err.clientErrors.length) {
    const errorMessages = err.clientErrors.map(
      (clientError) => clientError.message,
    );

    return `Client error: ${errorMessages.join(' | ')}`;
  }

  if (err.networkError) {
    return `Network error: ${err.networkError.message}`;
  }

  return err.message;
};
