import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { comboboxStyles } from '../../../../../uiComponents';
import { SelectedStop } from './schema';

export const FETCH_MORE_OPTION: SelectedStop = {
  stopPlaceId: 'FETCH_MORE',
  stopPlaceParentId: null,
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
      className={comboboxStyles.option('font-bold')}
    >
      {t('search.showMore')}
    </HUICombobox.Option>
  );
};
