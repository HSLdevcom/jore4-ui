/**
 * Alternatively LoadingPriority.
 * Should the spinner for the {@link Operation} be hidden, or should be shown
 * based on the set priority.
 */
export enum LoadingState {
  /** No spinner should be visible */
  NotLoading = 'notLoading',

  /** Spinner would be a distraction to the user.
   *  Prefer to silently load data on the background.
   *  Only show spinner if loading takes a real long time.
   * */
  LowPriority = 'lowPriority',

  /** Network operation should complete quickly,
   * but if it doesn't it would confuse the user.
   * Thus spinner should be shown soonish.
   * */
  MediumPriority = 'mediumPriority',

  /** Block further user action immediately, until network operation is done. */
  HighPriority = 'highPriority',
}
