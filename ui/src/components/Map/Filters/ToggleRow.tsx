import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../common/LayoutComponents';
import { IconToggle } from './IconToggle';
import { IconToggleProps } from './types';

type ToggleRowProps = {
  readonly toggles: ReadonlyArray<IconToggleProps>;
};

export const ToggleRow: FC<ToggleRowProps> = ({ toggles }) => {
  const { t } = useTranslation();

  return (
    <Row>
      {toggles.map(
        (
          {
            active,
            onToggle,
            iconClassName,
            activeColorClassName,
            inactiveColorClassName,
            disabled,
            testId,
            tooltip,
          },
          index: number,
        ) => (
          <IconToggle
            activeColorClassName={activeColorClassName}
            inactiveColorClassName={inactiveColorClassName}
            // We don't have proper ids to use as keys here.
            // This shouldn't matter as this array isn't dynamic.
            key={index} // eslint-disable-line react/no-array-index-key
            iconClassName={iconClassName}
            className="mr-1.5"
            active={active}
            onToggle={onToggle}
            disabled={disabled}
            testId={testId}
            tooltip={tooltip(t)}
          />
        ),
      )}
    </Row>
  );
};
