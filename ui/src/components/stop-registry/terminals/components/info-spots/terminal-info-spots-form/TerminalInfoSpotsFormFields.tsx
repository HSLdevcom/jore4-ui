import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
import { Column, Row } from '../../../../../../layoutComponents';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { SimpleButton } from '../../../../../../uiComponents';
import { AddNewButton } from '../../../../../../uiComponents/AddNewButton';
import {
  InputField,
  NullableBooleanDropdown,
} from '../../../../../forms/common';
import { PurposeFormFragment } from '../../../../stops/stop-details/info-spots/info-spots-form/PurposeFormFragment';
import { SizeFormFragment } from '../../../../stops/stop-details/info-spots/info-spots-form/SizeFormFragment';
import { TerminalInfoSpotFormState } from '../types';
import { resolveQuayPublicCode } from '../utils';
import { TerminalInfoSpotsFormPosters } from './TerminalInfoSpotsFormPosters';

const testIds = {
  description: 'TerminalInfoSpotFormFields::description',
  label: 'TerminalInfoSpotFormFields::label',
  purpose: 'TerminalInfoSpotFormFields::purpose',
  latitude: 'TerminalInfoSpotFormFields::latitude',
  longitude: 'TerminalInfoSpotFormFields::longitude',
  backlight: 'TerminalInfoSpotFormFields::backlight',
  floor: 'TerminalInfoSpotFormFields::floor',
  railInformation: 'TerminalInfoSpotFormFields::railInformation',
  zoneLabel: 'TerminalInfoSpotFormFields::zoneLabel',
  deleteInfoSpot: 'TerminalInfoSpotFormFields::deleteInfoSpot',
  addInfoSpotPoster: 'TerminalInfoSpotFormFields::addInfoSpotPoster',
  noPosters: 'TerminalInfoSpotFormFields::noPosters',
};

type TerminalInfoSpotFormFieldsProps = {
  readonly infoSpot?: InfoSpotDetailsFragment;
  readonly terminal: EnrichedParentStopPlace;
  readonly onRemove: () => void;
  readonly addPoster: () => void;
};

export const TerminalInfoSpotFormFields: FC<
  TerminalInfoSpotFormFieldsProps
> = ({ infoSpot, terminal, onRemove, addPoster }) => {
  const { register, watch, getValues, setValue } =
    useFormContext<TerminalInfoSpotFormState>();
  const toBeDeleted = watch('toBeDeleted');
  const posters = watch('poster');

  const isStopInfoSpot =
    infoSpot && !!resolveQuayPublicCode(infoSpot, terminal);

  const onRemovePoster = (posterIndex: number) => {
    const newToBeDeleted = !getValues(
      `poster.${posterIndex}.toBeDeletedPoster`,
    );
    setValue(`poster.${posterIndex}.toBeDeletedPoster`, newToBeDeleted, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true, // Add this to trigger revalidation
    });
  };

  return (
    <Column>
      <div className="bg-background-hsl-commuter-train-purple/25 p-5">
        <Row className="flex-wrap items-end gap-4 py-2.5">
          <InputField<TerminalInfoSpotFormState>
            type="text"
            translationPrefix="stopDetails.infoSpots"
            fieldPath="label"
            testId={testIds.label}
            disabled={toBeDeleted}
          />

          <PurposeFormFragment<TerminalInfoSpotFormState>
            purposeStatePath="purpose"
            titlePath="stopDetails.infoSpots.purpose"
            disabled={toBeDeleted}
          />

          <SizeFormFragment<TerminalInfoSpotFormState>
            sizeStatePath="size"
            titlePath="stopDetails.infoSpots.size"
            disabled={toBeDeleted}
          />

          <InputField<TerminalInfoSpotFormState>
            translationPrefix="stopDetails.infoSpots"
            fieldPath="backlight"
            testId={testIds.backlight}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <NullableBooleanDropdown
                placeholder={t('unknown')}
                buttonClassName="min-w-32"
                disabled={toBeDeleted}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
        </Row>

        <Row className="flex-wrap items-end gap-4 py-2.5 lg:flex-nowrap">
          <InputField<TerminalInfoSpotFormState>
            type="number"
            translationPrefix="terminalDetails.infoSpots"
            fieldPath="latitude"
            testId={testIds.latitude}
            disabled={toBeDeleted || isStopInfoSpot}
            inputClassName="w-36"
            step="any"
          />

          <InputField<TerminalInfoSpotFormState>
            type="number"
            translationPrefix="terminalDetails.infoSpots"
            fieldPath="longitude"
            testId={testIds.longitude}
            disabled={toBeDeleted || isStopInfoSpot}
            inputClassName="w-36"
            step="any"
          />

          <InputField<TerminalInfoSpotFormState>
            type="text"
            translationPrefix="stopDetails.infoSpots"
            fieldPath="zoneLabel"
            testId={testIds.zoneLabel}
            disabled={toBeDeleted}
          />

          <InputField<TerminalInfoSpotFormState>
            type="text"
            translationPrefix="stopDetails.infoSpots"
            fieldPath="railInformation"
            inputClassName="w-20"
            testId={testIds.railInformation}
            disabled={toBeDeleted}
          />

          <InputField<TerminalInfoSpotFormState>
            type="text"
            translationPrefix="stopDetails.infoSpots"
            fieldPath="floor"
            inputClassName="w-20"
            testId={testIds.floor}
            disabled={toBeDeleted}
          />
        </Row>

        <Column className="items-stretch gap-4 bg-background py-2.5">
          <InputField<TerminalInfoSpotFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath="description.value"
            testId={testIds.description}
            customTitlePath="stopDetails.infoSpots.description"
            disabled={toBeDeleted}
          />

          <SimpleButton
            className="self-start"
            shape="slim"
            testId={testIds.deleteInfoSpot}
            onClick={onRemove}
            inverted
          >
            {toBeDeleted
              ? t('stopDetails.infoSpots.cancelDeleteInfoSpot')
              : t('stopDetails.infoSpots.deleteInfoSpot')}
          </SimpleButton>
        </Column>
      </div>

      {posters?.length ? (
        posters.map((poster, posterIndex) => (
          <TerminalInfoSpotsFormPosters
            key={poster.id}
            posterIndex={posterIndex}
            addPoster={addPoster}
            onRemovePoster={onRemovePoster}
          />
        ))
      ) : (
        <Row className="items-center p-5">
          <span data-testid={testIds.noPosters}>
            <i className="icon-alert mr-2.5 text-hsl-red" role="presentation" />
            {t('stopDetails.infoSpots.noPosters')}
          </span>

          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t('stopDetails.infoSpots.addInfoSpotPoster')}
            onClick={addPoster}
            className="ml-auto"
          />
        </Row>
      )}

      <input type="checkbox" hidden {...register('toBeDeleted')} />
    </Column>
  );
};
