export enum KeyValueKeysEnum {
  ValidityStart = 'validityStart',
  ValidityEnd = 'validityEnd',
  Priority = 'priority',
  FunctionalArea = 'functionalArea',
  RailReplacement = 'railReplacement',
  Virtual = 'virtual',
  StreetAddress = 'streetAddress',
  PostalCode = 'postalCode',
  Municipality = 'municipality',
  FareZone = 'fareZone',
  TerminalType = 'terminalType',
  DeparturePlatforms = 'departurePlatforms',
  ArrivalPlatforms = 'arrivalPlatforms',
  LoadingPlatforms = 'loadingPlatforms',
  ElectricCharging = 'electricCharging',
  ElyNumber = 'elyNumber',
  ImportedId = 'imported-id',
  StopState = 'stopState',
  StopOwner = 'stopOwner',
  OwnerContractId = 'owner-contractId',
  OwnerNote = 'owner-note',
}

// Represents the values of hsl_municipality in LegacyHslMunicipalityCode table.
export enum LegacyHslMunicipality {
  LegacyNotUsed = 'legacy_not_used',
  Helsinki = 'helsinki',
  Espoo = 'espoo',
  TrainOrMetro = 'train_or_metro',
  Vantaa = 'vantaa',
  EspoonVantaaRegional = 'espoon_vantaa_regional',
  KirkkonummiAndSiuntio = 'kirkkonummi_and_siuntio',
  ULines = 'u_lines',
  TestingNotUsed = 'testing_not_used',
  TuusulaKeravaSipoo = 'tuusula_kerava_sipoo',
}

export enum JourneyType {
  Standard = 'STANDARD',
  DryRun = 'DRY_RUN',
  ServiceJourney = 'SERVICE_JOURNEY',
}

export enum Priority {
  Standard = 10, // used for "normal" in-use entities (e.g. routes, lines, stops)
  Temporary = 20, // overrides Standard, used for temporary adjustments
  Draft = 30, // overrides Temporary and Standard, not visible to external systems
}

export enum TimetablePriority {
  Standard = 10, // used for "normal" in-use entities
  Temporary = 20, // overrides Standard, used for temporary adjustments
  Special = 25, // special day that overrides Standard and Temporary
  Draft = 30, // overrides Special, Temporary and Standard, not visible to external systems
  Staging = 40, // imported from Hastus, not in use until priority is changed
}

export enum HasuraEnvironment {
  /** Enumeration for Hasura and database instances.
   * This is used to route data to the same Hasura and DB instance in e2e or dev context.
   */
  default = 'default',
  e2e = 'e2e',
}
