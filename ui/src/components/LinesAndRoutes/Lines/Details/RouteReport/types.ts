import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../../../generated/graphql';
import { OnProgress } from '../../../../StopRegistry/Stops/Common/Report/types';

export type GenerateRouteReport = (
  route: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  observationDate: Temporal.PlainDate,
  filename: string,
  saveFileNamePrompt: string,
  abortSignal: AbortSignal,
  onProgress: OnProgress,
) => Promise<string>;
