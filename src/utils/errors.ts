/* eslint max-classes-per-file: "off" */

import { ApolloError } from '@apollo/client';

// based on http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax

class ExtendableError extends Error {
  protected constructor(errorMessage?: string) {
    super(errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExtendableError.prototype);

    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(errorMessage).stack;
    }
  }
}

class GraphQLError extends ExtendableError {
  graphqlError?: ApolloError;

  protected constructor(graphqlError?: ApolloError, errorMessage?: string) {
    super(errorMessage);
    this.graphqlError = graphqlError;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, GraphQLError.prototype);
  }
}

export class LinkNotResolvedError extends GraphQLError {
  constructor(graphqlError?: ApolloError, errorMessage?: string) {
    super(graphqlError, errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LinkNotResolvedError.prototype);
  }
}

export class DirectionNotResolvedError extends GraphQLError {
  constructor(graphqlError?: ApolloError, errorMessage?: string) {
    super(graphqlError, errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DirectionNotResolvedError.prototype);
  }
}
