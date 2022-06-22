import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import { Row } from '../../../layoutComponents';
import { InputField } from '../common';
import { LineTypeDropdown } from './LineTypeDropdown';
import { TransportTargetDropdown } from './TransportTargetDropdown';
import { VehicleModeDropdown } from './VehicleModeDropdown';

export const schema = z.object({
  label: z.string().min(1),
  finnishName: z.string().min(1),
  transportTarget: z.nativeEnum(HslRouteTransportTargetEnum),
  primaryVehicleMode: z.nativeEnum(ReusableComponentsVehicleModeEnum),
  typeOfLine: z.nativeEnum(RouteTypeOfLineEnum),
});

export type FormState = z.infer<typeof schema>;

const testIds = {
  label: 'LinePropertiesForm:label',
  finnishName: 'LinePropertiesForm:finnishName',
  transportTargetDropdown: 'transport-target-input',
  vehicleModeDropdown: 'primary-vehicle-mode-input',
  lineTypeDropdown: 'type-of-line-input',
};
interface Props {
  id?: string;
  className?: string;
}

export const LinePropertiesForm = ({ id, className }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div id={id || ''} className={className || ''}>
      <Row>
        <h2 className="mb-8 text-2xl font-bold">{t('lines.properties')}</h2>
      </Row>
      <Row className="mb-5 space-x-10">
        <InputField<FormState>
          type="text"
          className="w-1/4"
          translationPrefix="lines"
          fieldPath="label"
          testId={testIds.label}
        />
      </Row>
      <Row className="mb-5 space-x-10">
        <InputField<FormState>
          type="text"
          className="w-1/2"
          translationPrefix="lines"
          fieldPath="finnishName"
          testId={testIds.finnishName}
        />
      </Row>
      <Row className="space-x-10">
        <InputField<FormState>
          className="w-1/4"
          translationPrefix="lines"
          fieldPath="transportTarget"
          testId={testIds.transportTargetDropdown}
          inputElementRenderer={(props) => (
            <TransportTargetDropdown
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<FormState>
          className="w-1/4"
          translationPrefix="lines"
          fieldPath="primaryVehicleMode"
          testId={testIds.vehicleModeDropdown}
          inputElementRenderer={(props) => (
            <VehicleModeDropdown
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<FormState>
          className="w-1/4"
          translationPrefix="lines"
          fieldPath="typeOfLine"
          testId={testIds.lineTypeDropdown}
          inputElementRenderer={(props) => (
            <LineTypeDropdown
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
      </Row>
    </div>
  );
};
