import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LinesByStop } from './types/LinesByStopResult';

type AffectedLinesFieldProps = {
  readonly affectedLines: ReadonlyArray<LinesByStop>;
};

export const AffectedLinesField: FC<AffectedLinesFieldProps> = ({
  affectedLines,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-full flex-row items-center">
      <i className="icon-alert mr-4 text-hsl-red" />
      <div className="flex flex-col text-sm">
        <p className="font-bold">
          {t('stopDetails.version.fields.affectedLines')}
        </p>
        <p>{affectedLines.map((l) => l.label).join(', ')}</p>
      </div>
    </div>
  );
};
