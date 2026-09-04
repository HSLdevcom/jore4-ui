import compact from 'lodash/compact';
import { getParentStopPlacesFromQueryResult } from '../../../../../../utils';
import { CSVWriter } from '../../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails, ReportSectionInstantiator } from '../types';
import { staticSection } from './utils';

type LinkLike = { readonly location?: string | null } | null;

function joinExternalLinkLocations(
  links: ReadonlyArray<LinkLike> | null | undefined,
): string {
  return compact(links?.map((link) => link?.location))
    .filter((location) => location.length > 0)
    .join('\n');
}

function writeRecordFields(
  writer: CSVWriter,
  { quay, stopPlace }: EnrichedStopDetails,
) {
  writer.writeTextField(joinExternalLinkLocations(quay.externalLinks));

  const terminal = getParentStopPlacesFromQueryResult(
    stopPlace.parentStopPlace,
  ).at(0);
  writer.writeTextField(joinExternalLinkLocations(terminal?.externalLinks));
}

export const ExternalLinksSection: ReportSectionInstantiator = staticSection(
  [],
  [
    (t) => t(($) => $.stopDetails.externalLinks.stopLink),
    (t) => t(($) => $.stopDetails.externalLinks.terminalLink),
  ],
  writeRecordFields,
  false,
);
