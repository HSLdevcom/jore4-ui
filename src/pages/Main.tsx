import React from 'react';
import { useTranslation } from 'react-i18next';
import { LOGIN_URL } from '../api/user';
import { useAppSelector } from '../hooks';
import { selectUser } from '../redux';
import { SimpleButton } from '../uiComponents';

export const Main: React.FC = () => {
  const { userInfo } = useAppSelector(selectUser);
  const { t } = useTranslation();

  return (
    <div data-testid="main" className="h-screen bg-brand bg-opacity-50 p-20">
      <div className="mx-auto w-4/5 rounded-lg bg-white p-10 leading-8 shadow-2xl">
        <h1 className="mb-10 text-center text-4xl font-bold">
          {t('welcomePage.heading')}
        </h1>
        <div className="space-y-6 text-xl">
          <h2 className="font-bold">{t('welcomePage.subheading1')}</h2>
          <p>{t('welcomePage.paragraph1')}</p>
          <h2 className="font-bold">{t('welcomePage.subheading2')}</h2>
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
export default Main;
