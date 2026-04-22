import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GetUserNameById } from '../../../hooks';
import {
  ChangedValuesWithHeaderRow,
  ChangedValuesWithHeaderRowProps,
} from './ChangedValuesWithHeaderRow';
import { NoChangedValuesWithHeaderRow } from './NoChangedValuesWithHeaderRow';
import { OptionalSimulatedEndOfTableBorder } from './OptionalSimulatedEndOfTableBorder';
import { BaseChangeHistoryItemDetails, ChangedValue } from './types';

type ChangedValueSection<HistoricalDataT> = {
  readonly diffVersions: (
    t: TFunction,
    previous: HistoricalDataT,
    current: HistoricalDataT,
  ) => ReadonlyArray<ChangedValue>;
  readonly sectionTitle: ReactNode;
  readonly sectionTitleClassName?: string;
  readonly testId: string;
};

type ChangeValueSectionsProps<HistoricalDataT> = {
  readonly current: HistoricalDataT;
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly noChangedValuesTitle: ReactNode;
  readonly noChangedValuesTitleClassName?: string;
  readonly noChangedValuesTitleTestId: string;
  readonly previous: HistoricalDataT;
  readonly sections: ReadonlyArray<ChangedValueSection<HistoricalDataT>>;
};

export const ChangeValueSections = <HistoricalDataT,>({
  current,
  getUserNameById,
  historyItem,
  noChangedValuesTitle,
  noChangedValuesTitleClassName,
  noChangedValuesTitleTestId,
  previous,
  sections,
}: ChangeValueSectionsProps<HistoricalDataT>): ReactNode => {
  const { t } = useTranslation();

  // Sections with non-empty diffs
  const preparedSections = compact(
    sections.map(
      ({
        diffVersions,
        sectionTitle,
        sectionTitleClassName,
        testId,
      }): ChangedValuesWithHeaderRowProps | null => {
        const changedValues = diffVersions(t, previous, current);

        if (changedValues.length === 0) {
          return null;
        }

        return {
          changedValues,
          getUserNameById,
          historyItem,
          sectionTitle,
          sectionTitleClassName,
          testId,
        };
      },
    ),
  );

  return (
    <>
      {preparedSections.length > 0 ? (
        preparedSections.map((props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <ChangedValuesWithHeaderRow key={props.testId} {...props} />
        ))
      ) : (
        <NoChangedValuesWithHeaderRow
          getUserNameById={getUserNameById}
          historyItem={historyItem}
          sectionTitle={noChangedValuesTitle}
          sectionTitleClassName={noChangedValuesTitleClassName}
          testId={noChangedValuesTitleTestId}
        />
      )}

      <OptionalSimulatedEndOfTableBorder />
    </>
  );
};
