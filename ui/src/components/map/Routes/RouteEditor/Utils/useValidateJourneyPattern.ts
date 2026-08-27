import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type JourneyPattern = {
  readonly includedStopLabels: ReadonlyArray<string>;
};

export function useValidateJourneyPattern() {
  const { t } = useTranslation();

  return useCallback(
    ({ includedStopLabels }: JourneyPattern) => {
      if (includedStopLabels.length < 2) {
        throw new Error(t(($) => $.routes.tooFewStops));
      }
    },
    [t],
  );
}
