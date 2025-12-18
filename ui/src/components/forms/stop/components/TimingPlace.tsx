import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../hooks';
import { Row } from '../../../../layoutComponents';
import { openTimingPlaceModalAction } from '../../../../redux';
import { SimpleButton } from '../../../../uiComponents';
import { InputField } from '../../common';
import { ChooseTimingPlaceDropdown } from '../ChooseTimingPlaceDropdown';

const testIds = {
  latitude: 'StopFormComponent::latitude',
  longitude: 'StopFormComponent::longitude',
  timingPlaceDropdown: 'StopFormComponent::timingPlaceDropdown',
  addTimingPlaceButton: 'StopFormComponent::addTimingPlaceButton',
};

type TimingPlaceProps = { readonly className?: string };

export const TimingPlace: FC<TimingPlaceProps> = ({ className }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Row className={className}>
      <InputField
        translationPrefix="stops"
        fieldPath="timingPlaceId"
        testId={testIds.timingPlaceDropdown}
        // eslint-disable-next-line react/no-unstable-nested-components
        inputElementRenderer={(props) => (
          <ChooseTimingPlaceDropdown
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        )}
        className="flex-1"
      />

      <SimpleButton
        className="ml-6 self-end"
        onClick={() => dispatch(openTimingPlaceModalAction())}
        testId={testIds.addTimingPlaceButton}
        inverted
      >
        {t('stops.createTimingPlace')}
      </SimpleButton>
    </Row>
  );
};
