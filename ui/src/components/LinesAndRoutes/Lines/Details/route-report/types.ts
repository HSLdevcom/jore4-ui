import { DateTime } from 'luxon';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../../../generated/graphql';
import { OnProgress } from '../../../../stop-registry/stops/Common/report/types';

export type GenerateRouteReport = (
  route: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  observationDate: DateTime,
  filename: string,
  saveFileNamePrompt: string,
  abortSignal: AbortSignal,
  onProgress: OnProgress,
) => Promise<string>;
