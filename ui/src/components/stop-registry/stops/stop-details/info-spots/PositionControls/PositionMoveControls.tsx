import { FC } from 'react';
import { twJoin } from 'tailwind-merge';
import { SimpleButton } from '../../../../../common/Buttons';
import { Row } from '../../../../../common/LayoutComponents';
import { useJustMovedAnimation } from './useJustMovedAnimation';

const testIds = {
  positionIndicator: (prefix: string) => `${prefix}::positionIndicator`,
  moveUp: (prefix: string) => `${prefix}::moveUp`,
  moveDown: (prefix: string) => `${prefix}::moveDown`,
};

type PositionMoveControlsProps = {
  readonly position: number;
  readonly total: number;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly disabled?: boolean;
  readonly onMoveUp: () => void;
  readonly onMoveDown: () => void;
  readonly testIdPrefix: string;
};

export const PositionMoveControls: FC<PositionMoveControlsProps> = ({
  position,
  total,
  isFirst,
  isLast,
  disabled,
  onMoveUp,
  onMoveDown,
  testIdPrefix,
}) => {
  const { justMoved, markJustMoved } = useJustMovedAnimation();

  const handleMoveUp = () => {
    onMoveUp();
    markJustMoved();
  };

  const handleMoveDown = () => {
    onMoveDown();
    markJustMoved();
  };

  return (
    <Row className="gap-2">
      <span
        data-testid={testIds.positionIndicator(testIdPrefix)}
        className={twJoin(
          'flex items-center rounded-sm p-2 transition-colors',
          justMoved ? 'bg-hsl-light-green' : 'bg-gray-300 duration-3000',
        )}
      >
        {position}/{total}
      </span>
      <SimpleButton
        className="rounded-sm px-2"
        shape="slim"
        testId={testIds.moveUp(testIdPrefix)}
        onClick={handleMoveUp}
        disabled={isFirst || disabled}
        inverted
      >
        <i className="icon-arrow rotate-180" />
      </SimpleButton>
      <SimpleButton
        className="rounded-sm px-2"
        shape="slim"
        testId={testIds.moveDown(testIdPrefix)}
        onClick={handleMoveDown}
        disabled={isLast || disabled}
        inverted
      >
        <i className="icon-arrow" />
      </SimpleButton>
    </Row>
  );
};
