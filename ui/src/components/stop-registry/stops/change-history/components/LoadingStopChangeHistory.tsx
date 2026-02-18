import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { theme } from '../../../../../generated/theme';

const testIds = {
  loading: 'StopChangeHistoryPage::Loading',
};

export const LoadingStopChangeHistory: FC = () => {
  const { t } = useTranslation();

  return (
    <tr>
      <td className="border p-5" colSpan={7}>
        <div
          className="flex flex-col items-center justify-center"
          data-testid={testIds.loading}
        >
          <PulseLoader color={theme.colors.brand} size={25} />
          <span className="mt-4">{t('changeHistory.loading')}</span>
        </div>
      </td>
    </tr>
  );
};
