export enum SortStopsBy {
  // Same enum will be used for: stops, StopAreas and Terminals.
  // All which have a different default sorting value.
  //
  // In Stop search by-label, or by-address: LABEL,
  // In Stop search by-line: SEQUENCE_NUMBER
  // In Stop Area search: BY_STOP_AREA
  DEFAULT = 'default',

  LABEL = 'label',
  NAME = 'name',
  ADDRESS = 'address',

  SEQUENCE_NUMBER = 'sequenceNumber',

  BY_STOP_AREA = 'byStopArea',
}
