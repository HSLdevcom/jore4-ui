// Add keys here if any else are needed
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

export type KeyValueKeys = keyof typeof KeyValueKeysEnum;
