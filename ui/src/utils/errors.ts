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

export class IncompatibleDirectionsError extends ExtendableError {
  constructor(errorMessage?: string) {
    super(errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, IncompatibleDirectionsError.prototype);
  }
}

export class EditRouteTerminalStopsError extends ExtendableError {
  constructor(errorMessage?: string) {
    super(errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, EditRouteTerminalStopsError.prototype);
  }
}

export class InternalError extends ExtendableError {
  constructor(errorMessage?: string) {
    super(errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InternalError.prototype);
  }
}

export class IncompatibleWithExistingRoutesError extends ExtendableError {
  constructor(errorMessage?: string) {
    super(errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, IncompatibleWithExistingRoutesError.prototype);
  }
}

export class MapMatchingNoSegmentError extends ExtendableError {
  constructor(errorMessage?: string) {
    super(errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MapMatchingNoSegmentError.prototype);
  }
}

export class TimingPlaceRequiredError extends ExtendableError {
  constructor(errorMessage?: string) {
    super(errorMessage);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TimingPlaceRequiredError.prototype);
  }
}

class GetCauseMessageError extends Error {
  get causeMessage() {
    const { cause } = this;
    if (typeof cause === 'object' && cause !== null && 'message' in cause) {
      return String(cause.message);
    }

    return '';
  }
}

export class TiamatUpdateFailedError extends GetCauseMessageError {}

export class StopPointUpdateFailed extends GetCauseMessageError {}
