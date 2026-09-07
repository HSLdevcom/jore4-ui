type TypedErrorConstructor<T extends Error> = {
  new (message?: string, options?: ErrorOptions): T;
};

export async function wrapErrors<PromisedValue, ErrorType extends Error>(
  promise: Promise<PromisedValue>,
  WrapperError: TypedErrorConstructor<ErrorType>,
  message: string,
): Promise<PromisedValue> {
  try {
    return await promise;
  } catch (cause) {
    throw new WrapperError(message, { cause });
  }
}
