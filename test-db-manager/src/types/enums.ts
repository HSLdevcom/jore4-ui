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
