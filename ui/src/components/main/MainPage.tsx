import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LOGIN_URL } from '../../api/user';
import { useAppSelector } from '../../hooks';
import { selectUser } from '../../redux';
import { SimpleButton } from '../../uiComponents';
import { PageTitle } from '../common';

const testIds = {
  main: 'Main',
};

export const MainPage: FC = () => {
  const { userInfo } = useAppSelector(selectUser);
  const { t } = useTranslation('common');
  const pageHeading = t('welcomePage.heading');

  return (
    <div
      data-testid={testIds.main}
      // The min-height is calculated to fill the screen except the navbar, which is 68px tall
      className="min-h-[calc(100vh-68px)] bg-welcome-gradient p-20"
    >
      <div className="mx-auto w-4/5 max-w-285 rounded-xl border-2 border-brand bg-white px-18.5 py-12 shadow-card">
        <PageTitle.H1
          className="mb-12 flex items-center justify-center gap-3 text-center"
          titleText={pageHeading}
        >
          <img
            src="/favicon.svg"
            alt={t('welcomePage.iconAlt')}
            className="h-9 w-9"
          />
          {pageHeading}
        </PageTitle.H1>

        <div className="mb-6 space-y-2.5">
          <h4>{t('welcomePage.subheading1')}</h4>
          <p className="text-lg">{t('welcomePage.paragraph1')}</p>
          <p className="text-lg">{t('welcomePage.paragraph2')}</p>
          <p className="text-lg">{t('welcomePage.paragraph3')}</p>

          <h4>{t('welcomePage.subheading2')}</h4>
          <p className="text-lg">{t('welcomePage.paragraph4')}</p>
        </div>

        <p className="mt-12 mb-6 text-center text-xl font-bold text-brand">
          {t('welcomePage.callout')}
        </p>

        {!userInfo?.permissions && (
          <SimpleButton
            // Workaround, because SimpleButton href does not seem to
            // work with urls that are proxied, because it uses React Router Link
            // under the hood instead of native <a>
            onClick={() => {
              window.location.href = LOGIN_URL;
            }}
            className="mx-auto px-6 py-3 text-sm"
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
