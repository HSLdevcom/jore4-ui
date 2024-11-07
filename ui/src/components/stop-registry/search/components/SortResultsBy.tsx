import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { PagingInfo } from '../../../../types';
import { SortStopsBy, SortingInfo } from '../types';
import { SortByButton } from './SortByButton';

type WithoutGroupOnlyFields = {
  readonly groupOnlyFields?: never;
  readonly setPagingInfo?: never;
};

type WithGroupOnlyFields = {
  readonly groupOnlyFields: ReadonlyArray<SortStopsBy>;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
};

type SortResultsByProps = {
  readonly className?: string;
  readonly mapDefaultTo: SortStopsBy;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
  readonly supportedFields: ReadonlyArray<SortStopsBy>;
} & (WithoutGroupOnlyFields | WithGroupOnlyFields);

export const SortResultsBy: FC<SortResultsByProps> = ({
  className,
  groupOnlyFields,
  mapDefaultTo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo: { sortBy: activeOrder, sortOrder },
  supportedFields,
}) => {
  const { t } = useTranslation();

  const actualOrder =
    activeOrder === SortStopsBy.DEFAULT ? mapDefaultTo : activeOrder;

  return (
    <div className={twMerge('flex gap-4', className)}>
      <p className="font-bold">{t('stopRegistrySearch.sortOrder')}</p>

      {supportedFields.map((sortBy) => (
        <SortByButton
          key={sortBy}
          isActive={actualOrder === sortBy}
          isDefault={mapDefaultTo === sortBy}
          setSortingInfo={setSortingInfo}
          sortBy={sortBy}
          sortOrder={sortOrder}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(groupOnlyFields
            ? {
                groupOnly: groupOnlyFields.includes(sortBy),
                setPagingInfo,
              }
            : { groupOnly: false })}
        />
      ))}
    </div>
  );
};
