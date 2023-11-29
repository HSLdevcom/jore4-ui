export enum CurrentExecutorIndex {
  /** Enumeration for
   * Hasura and database instances. This index number is used to
   * route data to the same Hasura and DB instance in e2e or dev context.
   */
  e2e1 = '1',
  default = '2',
}
