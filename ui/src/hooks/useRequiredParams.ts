import { useParams } from 'react-router';

/**
 * This is a workaround to get rid of possible undefined type from useParams
 *
 * After upgrading 'react-router' library to v6 'useParams' typed the parameter from the
 * URL path to be possibly undefined, which it should never be.
 * Example: If you have foo/:bar/punz, the 'bar' parameter can never be undefined.
 *
 * More information in this issue thread: https://github.com/remix-run/react-router/issues/8498
 */
export const useRequiredParams = <T extends Record<string, unknown>>() =>
  useParams() as T;
