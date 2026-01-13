import { Transition } from '@headlessui/react';
import { FC, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { ExpandButton } from '../../../../uiComponents';
import { LabeledDetail } from '../../../stop-registry/stops/stop-details/layout';
import { accordionClassNames } from '../../../stop-registry/stops/versions/utils';
import { StopFormState } from '../types';
import { formatIsoDateString } from '../utils';

const ID = 'StopAreaInfoSection';
const HeaderId = 'StopAreaInfoSection::Header';

const testIds = {
  showHideButton: 'StopAreaInfoSection::showHideButton',
  areaPrivateCode: 'StopAreaInfoSection::areaPrivateCode',
  areaValidityPeriod: 'StopAreaInfoSection::areaValidityPeriod',
  areaName: 'StopAreaInfoSection::areaName',
  areaNameSwe: 'StopAreaInfoSection::areaNameSwe',
  areaNameEng: 'StopAreaInfoSection::areaNameEng',
  areaNameLong: 'StopAreaInfoSection::areaNameLong',
  areaNameLongSwe: 'StopAreaInfoSection::areaNameLongSwe',
  areaNameLongEng: 'StopAreaInfoSection::areaNameLongEng',
  areaAbbreviationName: 'StopAreaInfoSection::areaAbbreviationName',
  areaAbbreviationNameSwe: 'StopAreaInfoSection::areaAbbreviationNameSwe',
  areaAbbreviationNameEng: 'StopAreaInfoSection::areaAbbreviationNameEng',
};

type StopAreaInfoSectionProps = {
  readonly className?: string;
};

export const StopAreaInfoSection: FC<StopAreaInfoSectionProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  const stopArea = useWatch<StopFormState, 'stopArea'>({ name: 'stopArea' });

  if (!stopArea) {
    return null;
  }

  return (
    <div className={twMerge('flex flex-col', className)}>
      <Link
        className="flex self-end"
        to={routeDetails[Path.stopAreaDetails].getLink(stopArea.privateCode, {
          observationDate,
        })}
        target="_blank"
        title={t('accessibility:stopAreas.showStopAreaDetails', {
          areaLabel: stopArea.nameFin ?? stopArea.nameSwe,
        })}
      >
        <span className="mr-2 font-bold">{stopArea.privateCode}</span>
        <span className="mr-2">{stopArea.nameFin ?? stopArea.nameSwe}</span>
        <span className="mr-2 font-bold">
          {`(${formatIsoDateString(stopArea.validityStart)}`}
          {stopArea.validityEnd
            ? ` - ${formatIsoDateString(stopArea.validityEnd)})`
            : ' - )'}
        </span>
        <i className="icon-open-in-new" role="presentation" />
      </Link>

      <ExpandButton
        className="self-end"
        ariaControls={ID}
        expanded={expanded}
        expandedText={t('stops.stopArea.showDetails')}
        onClick={() => setExpanded((p) => !p)}
        testId={testIds.showHideButton}
        iconClassName="text-base"
      />

      <Transition
        as="div"
        className="mt-2 flex flex-row flex-wrap gap-8 py-2"
        id={ID}
        role="region"
        show={expanded}
        aria-hidden={!expanded}
        aria-labelledby={HeaderId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...accordionClassNames}
      >
        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaNameSwe')}
          detail={stopArea.nameSwe}
          testId={testIds.areaNameSwe}
        />

        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaNameLongFin')}
          detail={stopArea.longNameFin}
          testId={testIds.areaNameLong}
        />
        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaNameLongSwe')}
          detail={stopArea.longNameSwe}
          testId={testIds.areaNameLongSwe}
        />

        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaAbbreviationFin')}
          detail={stopArea.abbreviationFin}
          testId={testIds.areaAbbreviationName}
        />
        <LabeledDetail
          title={t('stopDetails.basicAreaDetails.areaAbbreviationSwe')}
          detail={stopArea.abbreviationSwe}
          testId={testIds.areaAbbreviationNameSwe}
        />
        {(stopArea.nameEng ??
          stopArea.longNameEng ??
          stopArea.abbreviationEng) && (
          <>
            <LabeledDetail
              title={t('stopDetails.basicAreaDetails.areaNameEng')}
              detail={stopArea.nameEng}
              testId={testIds.areaNameEng}
            />
            <LabeledDetail
              title={t('stopDetails.basicAreaDetails.areaNameLongEng')}
              detail={stopArea.longNameEng}
              testId={testIds.areaNameLongEng}
            />
            <LabeledDetail
              title={t('stopDetails.basicAreaDetails.areaAbbreviationEng')}
              detail={stopArea.abbreviationEng}
              testId={testIds.areaAbbreviationNameEng}
            />
          </>
        )}
      </Transition>
    </div>
  );
};
