import { Switch as HuiSwitch } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Visible } from '../../../layoutComponents';
import { Switch, SwitchLabel, TextButton } from '../../../uiComponents';

type ListHeaderProps = {
  readonly showOwnLines: boolean;
  readonly limit?: number;
  readonly onShowOwnChange: (showOwnLines: boolean) => void;
  readonly onLimitChange: (limit: number) => void;
  readonly className?: string;
};

export const ListHeader: FC<ListHeaderProps> = ({
  showOwnLines,
  limit,
  onShowOwnChange,
  onLimitChange,
  className = '',
}) => {
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
