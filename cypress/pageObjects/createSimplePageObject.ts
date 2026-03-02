import identity from 'lodash/identity';

type MutablePageObjectFragment = {
  [Key in string]:
    | MutablePageObjectFragment
    | (() => Cypress.Chainable<JQuery>)
    | ((id: string) => Cypress.Chainable<JQuery>);
};

type TestIdToPageObjectFragment<TestId extends string> =
  TestId extends `${infer Prefix}::${infer Rest}`
    ? {
        readonly [Key in Uncapitalize<Prefix>]: TestIdToPageObjectFragment<Rest>;
      }
    : {
        readonly [Key in `get${Capitalize<TestId>}`]: () => Cypress.Chainable<JQuery>;
      };

type TestIdToPageObjectWithIdFragment<TestId extends string> =
  TestId extends `${infer Prefix}::${infer Rest}`
    ? {
        readonly [Key in Uncapitalize<Prefix>]: TestIdToPageObjectFragment<Rest>;
      }
    : {
        readonly [Key in `getAll${Capitalize<TestId>}Elements`]: () => Cypress.Chainable<JQuery>;
      } & {
        readonly [Key in `get${Capitalize<TestId>}`]: (
          id?: string,
        ) => Cypress.Chainable<JQuery>;
      };

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type FlattenUnion<T> = {
  [K in keyof UnionToIntersection<T>]: K extends keyof T
    ? T[K] extends unknown[]
      ? T[K]
      : T[K] extends object
        ? FlattenUnion<T[K]>
        : T[K]
    : UnionToIntersection<T>[K];
};

type IdsToPageObject<Ids extends string> = FlattenUnion<
  TestIdToPageObjectFragment<Ids>
>;

type IdsToPageObjectWithIds<Ids extends string> = FlattenUnion<
  TestIdToPageObjectWithIdFragment<Ids>
>;

type StripPrefix<
  Prefix extends string,
  TestId extends string,
> = TestId extends `${Prefix}::${infer Rest}` ? Rest : never;

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.substring(1);
}

function createSimplePageObjectImpl<
  Prefix extends string,
  TestIds extends `${Prefix}::${string}`,
>(
  prefix: Prefix,
  testIds: ReadonlyArray<TestIds>,
  slotInSelectors: (
    obj: MutablePageObjectFragment,
    localName: string,
    testId: string,
  ) => void,
): MutablePageObjectFragment {
  const rootObject: MutablePageObjectFragment = {};

  for (const testId of testIds) {
    const parts = testId
      .replace(`${prefix}::`, '')
      .split('::')
      .map(uncapitalize);

    let obj = rootObject;
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];

      if (i === parts.length - 1) {
        slotInSelectors(obj, part, testId);
      } else if (typeof obj[part] === 'object') {
        obj = obj[part];
      } else if (typeof obj[part] === 'undefined') {
        obj[part] = {};
        obj = obj[part];
      } else {
        throw new Error('Invalid state!');
      }
    }
  }

  return rootObject;
}

export function createSimplePageObject<
  Prefix extends string,
  TestIds extends `${Prefix}::${string}`,
  ExtendedPageObject extends IdsToPageObject<StripPrefix<Prefix, TestIds>> =
    IdsToPageObject<StripPrefix<Prefix, TestIds>>,
>(
  prefix: Prefix,
  testIds: ReadonlyArray<TestIds>,
  extend: (
    base: IdsToPageObject<StripPrefix<Prefix, TestIds>>,
  ) => ExtendedPageObject = identity,
): ExtendedPageObject {
  const rootObject = createSimplePageObjectImpl<Prefix, TestIds>(
    prefix,
    testIds,
    (obj, part, testId) => {
      // eslint-disable-next-line no-param-reassign
      obj[`get${capitalize(part)}`] = () => cy.getByTestId(testId);
    },
  );

  return extend(rootObject as IdsToPageObject<StripPrefix<Prefix, TestIds>>);
}

export function createPageObjectWithIdSelectors<
  Prefix extends string,
  TestIds extends `${Prefix}::${string}`,
  ExtendedPageObject extends IdsToPageObjectWithIds<
    StripPrefix<Prefix, TestIds>
  > = IdsToPageObjectWithIds<StripPrefix<Prefix, TestIds>>,
>(
  prefix: Prefix,
  testIds: ReadonlyArray<TestIds>,
  extend: (
    base: IdsToPageObjectWithIds<StripPrefix<Prefix, TestIds>>,
  ) => ExtendedPageObject = identity,
): ExtendedPageObject {
  const rootObject = createSimplePageObjectImpl<Prefix, TestIds>(
    prefix,
    testIds,
    (obj, part, testId) => {
      // eslint-disable-next-line no-param-reassign
      obj[`getAll${capitalize(part)}Elements`] = () =>
        cy.get(`[data-testid^="${testId}"]`);
      // eslint-disable-next-line no-param-reassign
      obj[`get${capitalize(part)}`] = (id?: string) => {
        if (id === undefined) {
          return cy.get(`[data-testid^="${testId}"]`).should('have.length', 1);
        }

        return cy.getByTestId(`${testId}::${id}`);
      };
    },
  );

  return extend(
    rootObject as IdsToPageObjectWithIds<StripPrefix<Prefix, TestIds>>,
  );
}
