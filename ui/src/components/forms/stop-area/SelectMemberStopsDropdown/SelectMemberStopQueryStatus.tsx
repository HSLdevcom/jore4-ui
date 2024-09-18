import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopAreaFormMember } from '../stopAreaFormSchema';

export const FETCH_MORE_OPTION: StopAreaFormMember = {
  id: 'FETCH_MORE',
  name: { value: '', lang: '' },
  scheduled_stop_point: { label: '' },
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
