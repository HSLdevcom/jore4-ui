import { StopRegistryQuayInput } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export type InsertQuayInput = {
  readonly stopPlaceId: string;
  readonly input: StopRegistryQuayInput;
};

export type InsertQuayInputs<Tags extends string> = Readonly<
  Record<Tags, InsertQuayInput>
>;

export type QuayTagToPublicCode<Tags extends string> = Readonly<
  Record<Tags, string>
>;

export type QuayTagToNetextId<Tags extends string> = Readonly<
  Record<Tags, string>
>;

export type QuayTagToShelters<Tags extends string> = Readonly<
  Record<Tags, ReadonlyArray<string>>
>;

export type InsertQuaysResult<Tags extends string> = {
  readonly inputs: InsertQuayInputs<Tags>;
  readonly tagToPublicCode: QuayTagToPublicCode<Tags>;
  readonly tagToNetextId: QuayTagToNetextId<Tags>;
  readonly tagToShelters: QuayTagToShelters<Tags>;
};
