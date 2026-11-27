import { FC } from 'react';
import { Priority } from '../../../../../../types/enums';
import { PrioritySymbol } from '../../../../../common/PrioritySymbol';
import { PriorityVisualizationType } from './PriorityVisualizationType';

type PriorityIconProps = {
  readonly type: PriorityVisualizationType;
  readonly priority: Priority;
};

const className = 'mx-2 mt-2 self-start';

export const PriorityIcon: FC<PriorityIconProps> = ({ type, priority }) =>
  type === PriorityVisualizationType.ABOUT_TO_END ? (
    <span className={`${className} icon-alert text-3xl text-hsl-red`} />
  ) : (
    <PrioritySymbol
      className={className}
      priority={
        type === PriorityVisualizationType.UNKNOWN
          ? Priority.Standard
          : priority
      }
      variant="large"
    />
  );
