import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  mapIntendedUserToUiName,
  mapZoneLabelToUiName,
} from '../../../../../i18n/uiNameMappings';
import { NullOptionEnum } from '../../../../../utils';
import { InfoSpotPosters } from '../../../components/InfoSpotPosters/InfoSpotPosters';
import { formatSizedDbItem } from '../../../stops/stop-details/info-spots/utils';
import { DetailRow, LabeledDetail } from '../../../stops/stop-details/layout';
import { optionalBooleanToUiText } from '../../../stops/stop-details/utils';
import { normalizeZoneLabel } from '../../../types/utils';
import { TerminalInfoSpotsViewCardProps } from './types';
import { getTerminalInfoSpotLocation } from './utils';

const testIds = {
  container: 'TerminalInfoSpotsViewCard::container',
  description: 'TerminalInfoSpotsViewCard::description',
  label: 'TerminalInfoSpotsViewCard::label',
  intendedUser: 'TerminalInfoSpotsViewCard::intendedUser',
  infoSpotType: 'TerminalInfoSpotsViewCard::infoSpotType',
  latitude: 'TerminalInfoSpotsViewCard::latitude',
  longitude: 'TerminalInfoSpotsViewCard::longitude',
  backlight: 'TerminalInfoSpotsViewCard::backlight',
  size: 'TerminalInfoSpotsViewCard::size',
  floor: 'TerminalInfoSpotsViewCard::floor',
  railInformation: 'TerminalInfoSpotsViewCard::railInformation',
  zoneLabel: 'TerminalInfoSpotsViewCard::zoneLabel',
};

export const TerminalInfoSpotsViewCard: FC<TerminalInfoSpotsViewCardProps> = ({
  infoSpot,
  terminal,
}) => {
  const { t } = useTranslation();
  const location = getTerminalInfoSpotLocation(infoSpot, terminal);

  return (
    <div data-testid={testIds.container}>
      <div className="bg-background-hsl-commuter-train-purple/25 p-5 pt-0">
        <DetailRow className="flex-wrap">
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.label)}
            detail={infoSpot.label}
            testId={testIds.label}
          />
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.intendedUser)}
            detail={mapIntendedUserToUiName(
              t,
              infoSpot.intendedUser ?? NullOptionEnum.Null,
            )}
            testId={testIds.intendedUser}
          />
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.size)}
            detail={formatSizedDbItem(t, infoSpot)}
            testId={testIds.size}
          />
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.backlight)}
            detail={optionalBooleanToUiText(t, infoSpot.backlight)}
            testId={testIds.backlight}
          />
          <LabeledDetail
            title={t(($) => $.stopDetails.location.latitude)}
            detail={location?.latitude}
            testId={testIds.latitude}
          />
          <LabeledDetail
            title={t(($) => $.stopDetails.location.longitude)}
            detail={location?.longitude}
            testId={testIds.longitude}
          />
        </DetailRow>
        <DetailRow>
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.zoneLabel)}
            detail={mapZoneLabelToUiName(
              t,
              normalizeZoneLabel(infoSpot.zoneLabel),
            )}
            testId={testIds.zoneLabel}
          />
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.railInformation)}
            detail={infoSpot.railInformation}
            testId={testIds.railInformation}
          />
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.floor)}
            detail={infoSpot.floor}
            testId={testIds.floor}
          />
        </DetailRow>
        <DetailRow>
          <LabeledDetail
            title={t(($) => $.stopDetails.infoSpots.description)}
            detail={infoSpot.description?.value}
            testId={testIds.description}
          />
        </DetailRow>
      </div>
      <InfoSpotPosters infoSpot={infoSpot} />
    </div>
  );
};
