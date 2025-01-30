import React from 'react';
import { useTranslation } from 'react-i18next';
import { LOGIN_URL } from '../../api/user';
import { useAppSelector } from '../../hooks';
import { selectUser } from '../../redux';
import { SimpleButton } from '../../uiComponents';
import { PageTitle } from '../common';

const testIds = {
  main: 'Main',
};

export const MainPage: React.FC = () => {
  const { userInfo } = useAppSelector(selectUser);
  const { t } = useTranslation();

  return (
    <div
      data-testid={testIds.main}
      className="min-h-screen bg-brand bg-opacity-50 p-20"
    >
      <div className="mx-auto w-4/5 rounded-lg bg-white p-10 leading-8 shadow-2xl">
        <PageTitle.H1 className="mb-10 text-center text-4xl">
          {t('welcomePage.heading')}
        </PageTitle.H1>
        <div className="mb-6 space-y-6 text-xl">
          <h3>{t('welcomePage.subheading1')}</h3>
          <p>{t('welcomePage.paragraph1')}</p>
          <h3>{t('welcomePage.subheading2')}</h3>
          <p>{t('welcomePage.paragraph2')}</p>
        </div>

        {!userInfo?.permissions && (
          <SimpleButton
            // Workaround, because SimpleButton href does not seem to
            // work with urls that are proxied, because it uses React Router Link
            // under the hood instead of native <a>
            onClick={() => {
              window.location.href = LOGIN_URL;
            }}
            containerClassName="w-full justify-center"
            className="!px-6 !py-3 text-sm"
          >
            {t('welcomePage.login')}
          </SimpleButton>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default MainPage;
