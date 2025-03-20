export function requireValue<T>(
  nullable: T | undefined | null,
): Exclude<T, undefined | null> {
  if (nullable === undefined || nullable === null) {
    throw new Error(
      `Expected non nullable value but it was: ${String(nullable)}`,
    );
  }

  return nullable as Exclude<T, undefined | null>;
}
