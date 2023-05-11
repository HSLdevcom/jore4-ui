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

export enum Priority {
  Standard = 10, // used for "normal" in-use entities (e.g. routes, lines, stops)
  Temporary = 20, // overrides Standard, used for temporary adjustments
  Draft = 30, // overrides Temporary and Standard, not visible to external systems
}

export enum TimetablePriority {
  Standard = 10, // used for "normal" in-use entities
  Temporary = 20, // overrides Standard, used for temporary adjustments
  SubstituteByLineType = 23, // substitute day by line type that overrides Standard and Temporary
  Special = 25, // special day that overrides Standard, Temporary and SubstituteByLineType
  Draft = 30, // overrides Special, Temporary and Standard, not visible to external systems
  Staging = 40, // imported from Hastus, not in use until priority is changed
}

/**
 * Day of week values used for example in substitute days.
 */
export enum DayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}
