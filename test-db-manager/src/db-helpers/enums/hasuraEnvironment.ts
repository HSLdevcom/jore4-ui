export enum HasuraEnvironment {
  /** Enumeration for Hasura and database instances.
   * This is used to route data to the same Hasura and DB instance in e2e or dev context.
   */
  default = 'default',
  e2e = 'e2e',
}
