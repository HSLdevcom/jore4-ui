import { NavigateOptions, To, useLocation, useNavigate } from 'react-router';

export function isBackNavigationSafe(state: unknown): boolean {
  return !!(
    state &&
    typeof state === 'object' &&
    'safeToNavigateBack' in state &&
    state.safeToNavigateBack
  );
}

type SafeToNavigateBackState = { readonly safeToNavigateBack: true };

const safeState: SafeToNavigateBackState = { safeToNavigateBack: true };

export function makeBackNavigationIsSafeState(): SafeToNavigateBackState;
export function makeBackNavigationIsSafeState<
  State extends Record<string, unknown>,
>(otherStateBits: State): State & SafeToNavigateBackState;
export function makeBackNavigationIsSafeState<
  State extends Record<string, unknown>,
>(
  otherStateBits?: State,
): (State & SafeToNavigateBackState) | SafeToNavigateBackState {
  if (otherStateBits) {
    return { ...otherStateBits, safeToNavigateBack: true };
  }

  return safeState;
}

type SafeBackNavigationFn = (to: To, options?: NavigateOptions) => void;

/**
 * Allows navigating to previous page, while preventing cross domain navigation.
 *
 *
 * Preface: React Router's navigation is directly tied to the {@link History}
 *          API. React Router does "hijack" and abstract over the API,
 *          but ultimately all React Router navigation boil down the
 *          {@link History.pushState}, {@link History.replaceState} and
 *          {@link History.go} API methods.
 *
 *
 * Problem: Say the user is initially on another domain (even on browser homepage)
 *          and then navigates to __Jore__ with link, e.g. from Teams or bookmark,
 *          the History stack will look like `[domain.fi, jore.fi/page]`. <p/>
 *          Now navigating back one page will take the user back to __domain.fi__.
 *          So if we have a '*Go back*'-button on the page that simply pops the
 *          last entry from the stack, could result in unexpected cross domain
 *          navigation.
 *
 *
 * Simple solution: Never do index based navigation, i.e. no real'*Go back*' or
 * '*Go forward*'-buttons. While simple this can result in non-optimal browser
 * History stacks. For example in the case of Stop Version Page's '*Go back*'
 * -button we could have the 2 to scenarios. § in front of the path shall
 * refer to the active page. <p/>
 * Initial History stack: `[/…/search/, /…/stops/A1, §/…/stops/A1/versions]`
 *
 * 1. Navigating "back" with simple pushState would result in history stack:
 *    `[/…/search/, /…/stops/A1, /…/stops/A1/versions, §/…/stops/A1]`, thus if
 *    the user was to then press the browsers Back-button they would end up
 *    back on the Versions page instead of the assumed Stop Search page.
 *    Also, if the user was to press the browsers Forward-button nothing would
 *    happen, as the user is already on the latest page.
 *
 * 2. Navigating "back" with replaceState would result in history stack:
 *    `[/…/search/, §/…/stops/A1]`. This time a browser Back-button would take
 *    the user to the assumed Stop Search page. But now the temporary navigation
 *    to Versions page has been completely erased from the navigation history.
 *    If the user was to press the browsers Forward-button nothing would happen,
 *    as the user is already on the latest page.
 *
 *
 * Proper solution: Determine if the previous page in the stack belongs to the
 * same domain, if so navigate back `navigate(-1)` else perform the navigation
 * somehow else, in not so optimal manner.
 *
 * Problem: The History API does not expose any info about previous or "upcoming"
 * pages to current page. E.g. the is no `history.peek()` method. Thus, the
 * "safeness" of the back navigation needs to be somehow encoded in the current
 * page's {@link History.state} value.
 *
 *
 * In React Router V7 the `useLocation().key` property will be set to `default`
 * on the initial location. Once we upgrade to V7 we can use that to safely
 * and consistently determine whether we are on the 1st page of the App or
 * if we have already done in App page navigation.
 *
 * But for now we have to encode the info manually at the point where we expose
 * a navigation into a page, that need support for safe back navigation.
 * See {@link makeBackNavigationIsSafeState} and {@link isBackNavigationSafe}
 *
 * @return {SafeBackNavigationFn}
 */
export function useNavigateBackSafely(): SafeBackNavigationFn {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (fallback: To, options) => {
    if (isBackNavigationSafe(state)) {
      navigate(-1);
    } else {
      navigate(fallback, options);
    }
  };
}
