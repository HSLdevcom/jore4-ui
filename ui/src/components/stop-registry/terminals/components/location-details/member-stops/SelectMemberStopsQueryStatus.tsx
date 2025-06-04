import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectedStop } from '../location-details-form/schema';

export const FETCH_MORE_OPTION: SelectedStop = {
  stopPlaceId: 'FETCH_MORE',
  name: '',
  quayId: '',
  publicCode: '',
  validityStart: '',
  validityEnd: '',
  indefinite: false,
};

type SelectMemberStopQueryStatusProps = {
  readonly allFetched: boolean;
  readonly loading: boolean;
  readonly query: string;
};

export const SelectMemberStopQueryStatus: FC<
  SelectMemberStopQueryStatusProps
> = ({ allFetched, loading, query }) => {
  const { t } = useTranslation();

  if (query === '' || allFetched) {
    return null;
  }

  if (loading) {
    return <p>{t('search.searching')}</p>;
  }

  return (
    <HUICombobox.Option
      as="div"
      value={FETCH_MORE_OPTION}
      className="cursor-pointer border-b p-2 text-left font-bold focus:outline-none ui-active:bg-dark-grey ui-active:text-white"
    >
      {t('search.showMore')}
    </HUICombobox.Option>
  );
};
