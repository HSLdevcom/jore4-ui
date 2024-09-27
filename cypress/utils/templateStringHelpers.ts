const objectToStringCache = new WeakMap<object, string>();

function expressionToString(expression: unknown): string {
  if (typeof expression === 'object' && expression) {
    if (!objectToStringCache.has(expression)) {
      objectToStringCache.set(expression, JSON.stringify(expression, null, 2));
    }

    return objectToStringCache.get(expression) as string;
  }

  return String(expression);
}

// Basically replaces objects with JSON versions
export function debug(
  stringParts: TemplateStringsArray,
  ...expressions: ReadonlyArray<unknown>
): string {
  const totalParts = stringParts.length + expressions.length;
  const resultArray = new Array<string>(totalParts);

  for (let i = 0; i < totalParts; i += 1) {
    const j = Math.floor(i / 2);

    if (i % 2 === 0) {
      resultArray[i] = stringParts[j];
    } else {
      resultArray[i] = expressionToString(expressions[j]);
    }
  }

  return resultArray.join('');
}
