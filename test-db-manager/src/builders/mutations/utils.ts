import { DocumentNode } from 'graphql';

export function getGqlString(doc: DocumentNode): string {
  const body = doc.loc?.source.body;

  if (!body) {
    throw new Error(
      `Unable to locate GraphGL query! Document:\n${JSON.stringify(doc, null, 2)}`,
    );
  }

  return body;
}
