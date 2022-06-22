export enum Priority {
  Standard = 10, // used for "normal" in-use entities (e.g. routes, lines, stops)
  Temporary = 20, // overrides Standard, used for temporary adjustments
  Draft = 30, // overrides Temporary and Standard, not visible to external systems
}
