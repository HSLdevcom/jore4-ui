import { DateTime } from 'luxon';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../../../generated/graphql';
import { OnProgress } from '../../../../StopRegistry/Stops/Common/Report/types';

export type GenerateRouteReport = (
  route: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  observationDate: DateTime,
  filename: string,
  saveFileNamePrompt: string,
  abortSignal: AbortSignal,
  onProgress: OnProgress,
) => Promise<string>;
