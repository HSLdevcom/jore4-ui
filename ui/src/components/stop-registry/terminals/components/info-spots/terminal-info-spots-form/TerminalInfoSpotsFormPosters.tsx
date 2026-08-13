import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { AddNewButton, SimpleButton } from '../../../../../common/Buttons';
import { InputField } from '../../../../../common/Inputs';
import { Row } from '../../../../../common/LayoutComponents';
import {
  PurposeFormFragment,
  SizeFormFragment,
} from '../../../../stops/stop-details/info-spots/info-spots-form/FormFragments';
import { PositionMoveControls } from '../../../../stops/stop-details/info-spots/PositionControls';
import { TerminalInfoSpotFormState } from '../types';

const testIds = {
  addInfoSpotPoster: 'TerminalInfoSpotFormFields::addInfoSpotPoster',
  posterContainer: 'TerminalInfoSpotPosterFormFields::container',
  posterSize: 'TerminalInfoSpotPosterFormFields::posterSize',
  posterDetails: 'TerminalInfoSpotPosterFormFields::posterDetails',
  deleteInfoSpotPoster: 'TerminalInfoSpotFormFields::deleteInfoSpotPoster',
};

type TerminalInfoSpotsFormPostersProps = {
  readonly posterIndex: number;
  readonly addPoster: () => void;
  readonly onRemovePoster: (posterIndex: number) => void;
  readonly onMovePosterUp: (posterIndex: number) => void;
  readonly onMovePosterDown: (posterIndex: number) => void;
  readonly isFirstPoster: boolean;
  readonly isLastPoster: boolean;
  readonly totalPosters: number;
};

export const TerminalInfoSpotsFormPosters: FC<
  TerminalInfoSpotsFormPostersProps
> = ({
  posterIndex,
  addPoster,
  onRemovePoster,
  onMovePosterUp,
  onMovePosterDown,
  isFirstPoster,
  isLastPoster,
  totalPosters,
}) => {
  const { watch } = useFormContext<TerminalInfoSpotFormState>();
  const toBeDeletedPoster = watch(`poster.${posterIndex}.toBeDeletedPoster`);

  return (
    <div data-testid={testIds.posterContainer}>
      <Row className="my-5 flex-wrap items-end gap-4 pr-5 pl-10">
        <SizeFormFragment<TerminalInfoSpotFormState>
          titlePath="stopDetails.infoSpots.posterSize"
          sizeStatePath={`poster.${posterIndex}.size`}
          disabled={toBeDeletedPoster}
        />

        <PurposeFormFragment<TerminalInfoSpotFormState>
          purposeStatePath={`poster.${posterIndex}.label`}
          titlePath="stopDetails.infoSpots.posterPurpose"
          disabled={toBeDeletedPoster}
        />
        <InputField<TerminalInfoSpotFormState>
          type="text"
          translationPrefix="terminalDetails"
          fieldPath={`poster.${posterIndex}.lines`}
          customTitlePath="terminalDetails.infoSpots.posterDetails"
          testId={testIds.posterDetails}
          disabled={toBeDeletedPoster}
          className="grow"
        />
      </Row>
      <Row className="justify-between pr-5 pb-5 pl-10">
        <SimpleButton
          shape="slim"
          testId={testIds.deleteInfoSpotPoster}
          onClick={() => onRemovePoster(posterIndex)}
          inverted
        >
          {t(($) =>
            toBeDeletedPoster
              ? $.stopDetails.infoSpots.cancelDeleteInfoSpot
              : $.stopDetails.infoSpots.deleteInfoSpotPoster,
          )}
        </SimpleButton>
        <PositionMoveControls
          position={posterIndex + 1}
          total={totalPosters}
          isFirst={isFirstPoster}
          isLast={isLastPoster}
          disabled={toBeDeletedPoster}
          onMoveUp={() => onMovePosterUp(posterIndex)}
          onMoveDown={() => onMovePosterDown(posterIndex)}
          testIdPrefix="TerminalInfoSpotPosterFormFields"
        />
      </Row>
      <Row className="pr-5 pb-5 pl-10">
        {isLastPoster && (
          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t(($) => $.stopDetails.infoSpots.addInfoSpotPoster)}
            onClick={addPoster}
            className="ml-auto"
          />
        )}
      </Row>
    </div>
  );
};
