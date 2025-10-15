import { gql } from '@apollo/client';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { useGetStopSearchResultsForCsvLazyQuery } from '../../../../generated/graphql';
import { theme } from '../../../../generated/theme';
import { mapPriorityToUiName } from '../../../../i18n/uiNameMappings';
import { mapToShorTime, mapToShortDate } from '../../../../time';
import { SimpleButton } from '../../../../uiComponents';
import {
  notNullish,
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils';
import { CSVWriter } from '../../../common/ReportWriter/CSVWriter';
import { StopSearchRow, mapQueryResultToStopSearchRow } from '../../components';
import { StopSearchFilters } from '../types';
import { buildSearchStopsGqlQueryVariables } from './filtersToQueryVariables';

const testIds = {
  button: 'DownloadResultsAsCSVButton::button',
  loading: 'DownloadResultsAsCSVButton::loading',
  filename: 'DownloadResultsAsCSVButton::filename',
};

const GQL_GET_STOP_SEARCH_RESULTS_FOR_CSV = gql`
  query GetStopSearchResultsForCSV(
    $filters: stops_database_quay_newest_version_bool_exp!
    $cursor: bigint!
    $limit: Int!
  ) {
    stops_database {
      stops: stops_database_quay_newest_version(
        where: { _and: [$filters, { id: { _gt: $cursor } }] }
        limit: $limit
        order_by: [{ id: asc }]
      ) {
        ...stop_table_row_quay
      }
    }
  }
`;

const actualHeaderRows = [
  (t: TFunction) => t('stopDetails.basicDetails.label'),
  (t: TFunction) => t('priority.label'),
  (t: TFunction) => t('stops.timingPlaceId'),

  (t: TFunction) => t('stopDetails.basicDetails.nameFin'),
  (t: TFunction) => t('stopDetails.basicDetails.nameSwe'),

  (t: TFunction) => t('stopDetails.location.longitude'),
  (t: TFunction) => t('stopDetails.location.latitude'),

  (t: TFunction) => t('validityPeriod.validityStart'),
  (t: TFunction) => t('validityPeriod.validityEnd'),
];

function writeHeader(
  t: TFunction,
  writer: CSVWriter,
  filters: StopSearchFilters,
) {
  // Pre header, meta data rows
  writer.writeTextField(t('filters.observationDate'));
  writer.writeTextField(mapToShortDate(filters.observationDate));
  writer.closePartialRecord(); // Finish the meta header section

  writer.closePartialRecord(); // Empty row

  // Actual header rows
  actualHeaderRows.forEach((genText) => writer.writeTextField(genText(t)));

  writer.closeRecord();
}

function writeStops(writer: CSVWriter, stop: StopSearchRow) {
  writer.writeTextField(stop.publicCode);
  writer.writeEnumField(stop.priority, mapPriorityToUiName);
  writer.writeTextField(stop.timingPlace?.label);

  writer.writeTextField(stop.nameFin);
  writer.writeTextField(stop.nameSwe);

  writer.writeNumberField(stop.location.coordinates.at(0));
  writer.writeNumberField(stop.location.coordinates.at(1));

  writer.writeDateField(stop.validityStart);
  writer.writeDateField(stop.validityEnd);

  writer.closeRecord();
}

function useScrollAndConsumeResults() {
  const [getStopSearchResultsForCSV] = useGetStopSearchResultsForCsvLazyQuery();

  return async (
    filters: StopSearchFilters,
    consume: (stop: StopSearchRow) => void,
  ) => {
    const whereFilters = buildSearchStopsGqlQueryVariables(filters);

    const limit = 1000;
    let cursor: string | number | bigint = 0;
    let hasMore = true;

    while (hasMore) {
      // eslint-disable-next-line no-await-in-loop
      const { data } = await getStopSearchResultsForCSV({
        variables: {
          filters: whereFilters,
          cursor,
          limit,
        },
      });

      const rawStops = data?.stops_database?.stops ?? [];

      rawStops
        ?.values()
        .map((rawStop) =>
          mapQueryResultToStopSearchRow(
            rawStop,
            rawStop.scheduled_stop_point_instance,
          ),
        )
        .filter(notNullish)
        .forEach(consume);

      hasMore = rawStops.length === limit;
      cursor = rawStops[rawStops.length - 1].id;
    }
  };
}

function useGenerateAndDownloadReport(
  setGenerating: Dispatch<SetStateAction<boolean>>,
  filters: StopSearchFilters,
) {
  const { t } = useTranslation();
  const scrollAndConsumeResults = useScrollAndConsumeResults();

  return () => {
    setGenerating(true);
    setTimeout(async () => {
      try {
        // CSVWriter allocates a Data URL which needs to be "manually"
        // de-allocated after use. 'using' dispatches to the cleanup method.
        using writer = new CSVWriter(t, actualHeaderRows.length);
        writeHeader(t, writer, filters);

        await scrollAndConsumeResults(filters, (stop) =>
          writeStops(writer, stop),
        );

        writer.closeReport();

        const dateTimeNow = DateTime.now();
        const fileName = t('stopRegistrySearch.csvFileName', {
          today: mapToShortDate(dateTimeNow),
          now: mapToShorTime(dateTimeNow),
        });
        writer.download(fileName);
        showSuccessToast(
          <Trans
            t={t}
            i18nKey="stopRegistrySearch.csvDownloaded"
            components={{
              Filename: <span data-testid={testIds.filename}>{fileName}</span>,
            }}
          />,
        );

        setGenerating(false);
      } catch (e) {
        showDangerToastWithError(t('stopRegistrySearch.csvGenerationError'), e);
      }
    }, 0);
  };
}

type DownloadResultsAsCSVButtonProps = {
  readonly className?: string;
  readonly filters: StopSearchFilters;
};

export const DownloadResultsAsCSVButton: FC<
  DownloadResultsAsCSVButtonProps
> = ({ className, filters }) => {
  const { t } = useTranslation();

  const [generating, setGenerating] = useState<boolean>(false);

  const onClick = useGenerateAndDownloadReport(setGenerating, filters);

  return (
    <SimpleButton
      className={twMerge(
        'px-3 py-1 text-sm leading-none disabled:cursor-wait',
        className,
      )}
      disabled={generating}
      onClick={onClick}
      testId={testIds.button}
      type="button"
    >
      {generating ? (
        <PulseLoader
          color={theme.colors.brand}
          cssOverride={{ margin: '-2px' }}
          data-testid={testIds.loading}
          size={14}
        />
      ) : (
        t('stopRegistrySearch.downloadAsCsv')
      )}
    </SimpleButton>
  );
};
