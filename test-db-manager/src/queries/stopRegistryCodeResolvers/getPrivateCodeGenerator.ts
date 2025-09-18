import { DocumentNode } from 'graphql';
import { gql } from 'graphql-tag';
import { getGqlString } from '../../builders/mutations/utils';
import { GetQuayMaxPrivateCodeQuery } from '../../generated/graphql';
import { hasuraApi } from '../../hasuraApi';

const GQL_GET_QUAY_MAX_PRIVATE_CODE = gql`
  query GetQuayMaxPrivateCode {
    sdb: stops_database {
      table: stops_database_quay_aggregate(
        where: { private_code_value: { _like: "7______" } }
      ) {
        aggregate {
          max {
            code: private_code_value
          }
        }
      }
    }
  }
`;

const GQL_GET_STOP_AREA_MAX_PRIVATE_CODE = gql`
  query GetStopAreaMaxPrivateCode {
    sdb: stops_database {
      table: stops_database_stop_place_aggregate(
        where: {
          private_code_value: { _like: "7_____" }
          parent_stop_place: { _eq: false }
        }
      ) {
        aggregate {
          max {
            code: private_code_value
          }
        }
      }
    }
  }
`;

const GQL_GET_TERMINAL_MAX_PRIVATE_CODE = gql`
  query GetTerminalMaxPrivateCode {
    sdb: stops_database {
      table: stops_database_stop_place_aggregate(
        where: {
          private_code_value: { _like: "7______" }
          parent_stop_place: { _eq: true }
        }
      ) {
        aggregate {
          max {
            code: private_code_value
          }
        }
      }
    }
  }
`;

type PrivateCodeEntityType = 'quay' | 'area' | 'terminal';

type MinMax = {
  readonly min: number;
  readonly max: number;
};

const codeRanges: Readonly<Record<PrivateCodeEntityType, MinMax>> = {
  quay: { min: 7000000, max: 7999999 },
  area: { min: 700000, max: 799999 },
  terminal: { min: 7000000, max: 7999999 },
} as const;

const queries: Readonly<Record<PrivateCodeEntityType, DocumentNode>> = {
  quay: GQL_GET_QUAY_MAX_PRIVATE_CODE,
  area: GQL_GET_STOP_AREA_MAX_PRIVATE_CODE,
  terminal: GQL_GET_TERMINAL_MAX_PRIVATE_CODE,
};

class Incrementable {
  #value: number;

  constructor(value: number) {
    this.#value = value;
  }

  increment() {
    this.#value += 1;
    return this.#value;
  }
}

type PrivateCodeGeneratorFn = () => Promise<string>;

export function getPrivateCodeGenerator(
  entity: PrivateCodeEntityType,
): PrivateCodeGeneratorFn {
  const minMax = codeRanges[entity];

  // Initialize DB query, and perform it on the background.
  // Keep this top level function synchronous, by only capturing the Promise
  // without awaiting it here yet.
  const promisedMaxCode = hasuraApi<GetQuayMaxPrivateCodeQuery>(
    { query: getGqlString(queries[entity]) },
    true,
  )
    .then((result) => result.data?.sdb?.table.aggregate?.max?.code)
    .then((rawMaxCode) => Math.max(minMax.min, Number(rawMaxCode ?? 0)))
    .then((maxCode) => new Incrementable(maxCode));

  // Had we awaited the DB's max code in the parent function, we could return
  // a synchronous code generator. But at the cost of slightly more obscure code,
  // doing it this way nicely aligns the private code generator with the
  return async () => {
    const maxCode = await promisedMaxCode;
    const nextCode = maxCode.increment();

    if (nextCode > minMax.max) {
      throw new Error('No more private codes available!');
    }

    return nextCode.toString(10);
  };
}
