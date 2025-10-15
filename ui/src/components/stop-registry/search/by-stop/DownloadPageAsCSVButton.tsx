import { TFunction } from 'i18next';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { theme } from '../../../../generated/theme';
import { mapPriorityToUiName } from '../../../../i18n/uiNameMappings';
import { SimpleButton } from '../../../../uiComponents';
import { CSVWriter } from '../../../common/ReportWriter/CSVWriter';
import { StopSearchRow } from '../../components';

function writeHeader(writer: CSVWriter) {
  writer.writeTextField('Tunnus');
  writer.writeTextField('Prioriteetti');
  writer.writeTextField('Hastus-paikka');

  writer.writeTextField('Nimi (suomi)');
  writer.writeTextField('Nimi (ruotsi)');

  writer.writeTextField('Leveysaste');
  writer.writeTextField('Pituusaste');

  writer.writeTextField('Alkaa');
  writer.writeTextField('Loppuu');

  writer.closeRecord();
}

function writeStops(writer: CSVWriter, stop: StopSearchRow) {
  writer.writeTextField(stop.publicCode);
  writer.writeEnumField(stop.priority, mapPriorityToUiName);
  writer.writeTextField(stop.timingPlace?.label);

  writer.writeTextField(stop.nameFin);
  writer.writeTextField(stop.nameSwe);

  writer.writeNumberField(stop.location.coordinates.at(0));
  writer.writeNumberField(stop.location.coordinates.at(1));

  writer.writeDateField(stop.validityStart);
  writer.writeDateField(stop.validityEnd);

  writer.closeRecord();
}

function generateAndDownloadReport(
  t: TFunction,
  stops: ReadonlyArray<StopSearchRow>,
) {
  using writer = new CSVWriter(t);
  writeHeader(writer);

  // eslint-disable-next-line no-restricted-syntax
  for (const stop of stops) {
    writeStops(writer, stop);
  }

  writer.closeReport();
  writer.download('Esimerkki raportti.csv');
}

type DownloadPageAsCSVButtonProps = {
  readonly className?: string;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

export const DownloadPageAsCSVButton: FC<DownloadPageAsCSVButtonProps> = ({
  className,
  stops,
}) => {
  const { t } = useTranslation();

  const [generating, setGenerating] = useState<boolean>(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      generateAndDownloadReport(t, stops);

      setGenerating(false);
    }, 0);
  };

  return (
    <SimpleButton
      className={twMerge(
        'px-3 py-1 text-sm leading-none disabled:cursor-wait',
        className,
      )}
      disabled={generating}
      onClick={generate}
      type="button"
    >
      {generating ? (
        <PulseLoader
          color={theme.colors.brand}
          cssOverride={{ margin: '-2px' }}
          size={14}
        />
      ) : (
        'Lataa CSV muodossa'
      )}
    </SimpleButton>
  );
};
