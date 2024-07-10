import { Switch as HuiSwitch } from '@headlessui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Visible } from '../../../layoutComponents';
import { Switch, SwitchLabel, TextButton } from '../../../uiComponents';

type Props = {
  showOwnLines: boolean;
  limit?: number;
  onShowOwnChange: (showOwnLines: boolean) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
};

export const ListHeader = ({
  showOwnLines,
  limit,
  onShowOwnChange,
  onLimitChange,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const limitOptions = [5, 10, 15];

  return (
    <Row className={`${className ?? ''} `}>
      <Row className="grow items-center">
        {/** Hide until "own routes" can be selected */}
        <Visible visible={false}>
          <HuiSwitch.Group>
            <SwitchLabel className="my-1 mr-2">
              {t('routes.showOwnLines')}
            </SwitchLabel>
            <Switch checked={showOwnLines} onChange={onShowOwnChange} />
          </HuiSwitch.Group>
        </Visible>
      </Row>
      <Row className="items-center">
        <span>{t('routes.showLimit')}:</span>
        {limitOptions.map((item, index) => (
          <span key={`limit_${item}`}>
            {index !== 0 && '|'}
            <TextButton
              active={limit === item}
              onClick={() => onLimitChange(item)}
              className="mx-1"
            >
              {item}
            </TextButton>
          </span>
        ))}
      </Row>
    </Row>
  );
};
