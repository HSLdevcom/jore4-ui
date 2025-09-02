import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Row } from '../../../../../../layoutComponents';
import { AddNewButton } from '../../../../../../uiComponents/AddNewButton';
import { InputField } from '../../../../../forms/common';
import { usePosterNames } from '../../../../stops/stop-details/info-spots/info-spots-form/InfoSpotsPosterNames';
import { SizeFormFragment } from '../../../../stops/stop-details/info-spots/info-spots-form/SizeFormFragment';
import { SlimSimpleButton } from '../../../../stops/stop-details/layout';
import { TerminalInfoSpotFormState } from '../types';

const testIds = {
  addInfoSpotPoster: 'TerminalInfoSpotFormFields::addInfoSpotPoster',
  posterContainer: 'TerminalInfoSpotPosterFormFields::container',
  posterSize: 'TerminalInfoSpotPosterFormFields::posterSize',
  posterLabel: 'TerminalInfoSpotPosterFormFields::posterLabel',
  posterDetails: 'TerminalInfoSpotPosterFormFields::posterDetails',
  deleteInfoSpotPoster: 'TerminalInfoSpotFormFields::deleteInfoSpotPoster',
};

type TerminalInfoSpotsFormPostersProps = {
  readonly posterIndex: number;
  readonly addPoster: () => void;
  readonly onRemovePoster: (posterIndex: number) => void;
};

export const TerminalInfoSpotsFormPosters: FC<
  TerminalInfoSpotsFormPostersProps
> = ({ posterIndex, addPoster, onRemovePoster }) => {
  const { watch } = useFormContext<TerminalInfoSpotFormState>();
  const toBeDeletedPoster = watch(`poster.${posterIndex}.toBeDeletedPoster`);

  const posters = watch('poster') ?? [];
  const isLastPoster = posterIndex === posters.length - 1;

  const posterOptions = usePosterNames();

  return (
    <div data-testid={testIds.posterContainer}>
      <Row className="my-5 flex-wrap items-end gap-4 px-10">
        <SizeFormFragment<TerminalInfoSpotFormState>
          titlePath="stopDetails.infoSpots.posterSize"
          sizeStatePath={`poster.${posterIndex}.size`}
          disabled={toBeDeletedPoster}
        />

        <InputField<TerminalInfoSpotFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`poster.${posterIndex}.label`}
          customTitlePath="stopDetails.infoSpots.posterLabel"
          testId={testIds.posterLabel}
          disabled={toBeDeletedPoster}
          list="posternames-data-list"
        />
        <datalist id="posternames-data-list">
          {posterOptions.map(({ label }) => (
            <option key={label} value={label ?? ''}>
              {label}
            </option>
          ))}
        </datalist>
        <InputField<TerminalInfoSpotFormState>
          type="text"
          translationPrefix="terminalDetails"
          fieldPath={`poster.${posterIndex}.lines`}
          customTitlePath="terminalDetails.infoSpots.posterDetails"
          testId={testIds.posterDetails}
          disabled={toBeDeletedPoster}
        />
      </Row>
      <Row className="px-10 pb-5">
        <SlimSimpleButton
          testId={testIds.deleteInfoSpotPoster}
          onClick={() => onRemovePoster(posterIndex)}
          inverted
        >
          {t(
            toBeDeletedPoster
              ? 'stopDetails.infoSpots.cancelDeleteInfoSpot'
              : 'stopDetails.infoSpots.deleteInfoSpotPoster',
          )}
        </SlimSimpleButton>
        {isLastPoster && (
          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t('stopDetails.infoSpots.addInfoSpotPoster')}
            onClick={addPoster}
            className="ml-auto"
          />
        )}
      </Row>
    </div>
  );
};
