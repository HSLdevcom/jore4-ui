import { HistoricalStopVersionSpecifier } from '../types';

export class HistoricalStopDataCacheInconsistencyError extends Error {
  constructor(version: HistoricalStopVersionSpecifier) {
    const versionJson = JSON.stringify(version, null, 0);
    super(
      [
        'Historical stop data cache seems to be in an inconsistent state.',
        'The specified StopPlace does exist in the cache.',
        `But the quay requested with version info (${versionJson}) was not found!`,
      ].join(' '),
    );
  }
}
