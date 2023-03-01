export enum CurrentExecutorIndex {
  /** Enumeration for currently enabled amount of
   * Cypress e2e test executor threads and their respective
   * Hasura and database instances. This index number is used to
   * route data to the same Hasura and DB instance within the test executor threads.
   */
  e2e1 = '1',
  e2e2 = '2',
  e2e3 = '3',
  default = '4',
}
