import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LineFetchError } from './useGetLineDetails';

const testIds = {
  notValidText: 'LineMissingBox::notValidText',
};

const useLineMissingTranslation = (error?: LineFetchError) => {
  const { t } = useTranslation();

  if (error === LineFetchError.LINE_NOT_VALID_FOR_DAY) {
    return t(($) => $.lines.lineNotValidForDay);
  }

  return t(($) => $.lines.lineMissingDefault);
};

type LineMissingBoxProps = {
  readonly error?: LineFetchError;
};

export const LineMissingBox: FC<LineMissingBoxProps> = ({ error }) => {
  return (
    <div className="flex h-72 w-full shrink-0 items-center justify-center border-light-grey bg-background">
      <span className="icon-alert p-2 text-hsl-red" />
      <p data-testid={testIds.notValidText} className="self-center">
        {useLineMissingTranslation(error)}
      </p>
    </div>
  );
};
