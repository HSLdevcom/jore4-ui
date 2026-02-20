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

const contentSections = [
  {
    heading: 'subheading1',
    paragraphs: ['paragraph1', 'paragraph2', 'paragraph3'],
  },
  {
    heading: 'subheading2',
    paragraphs: ['paragraph4'],
  },
];

export const MainPage: FC = () => {
  const { userInfo } = useAppSelector(selectUser);
  const { t } = useTranslation('common', { keyPrefix: 'welcomePage' });
  const heading = t('heading');

  return (
    <div
      data-testid={testIds.main}
      className="bg-welcome-gradient min-h-screen p-20"
    >
      <div className="shadow-card mx-auto w-4/5 max-w-285 rounded-[13px] border-2 border-brand bg-white px-18.5 py-12 leading-8">
        <PageTitle.H1
          className="mb-12 flex items-center justify-center gap-3 text-center text-[32px]"
          titleText={heading}
        >
          <img src="/favicon.svg" alt={t('iconAlt')} className="h-9 w-9" />
          {heading}
        </PageTitle.H1>

        <div className="mb-6 space-y-2.5">
          {contentSections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-[20px]">{t(section.heading)}</h3>
              {section.paragraphs.map((key) => (
                <p key={key} className="text-[18px]">
                  {t(key)}
                </p>
              ))}
            </div>
          ))}
        </div>

        {!userInfo?.permissions && (
          <>
            <p className="mt-12 mb-6 text-center text-[20px] font-bold text-brand">
              {t('callout')}
            </p>
            <SimpleButton
              // Workaround, because SimpleButton href does not seem to
              // work with urls that are proxied, because it uses React Router Link
              // under the hood instead of native <a>
              onClick={() => {
                window.location.href = LOGIN_URL;
              }}
              className="mx-auto px-6 py-3 text-sm"
            >
              {t('login')}
            </SimpleButton>
          </>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default MainPage;
