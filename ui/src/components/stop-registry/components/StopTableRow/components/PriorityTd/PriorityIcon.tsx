import { FC } from 'react';
import { twJoin } from 'tailwind-merge';
import { PriorityVisualizationType } from './PriorityVisualizationType';
import { SubComponentProps } from './SubComponentProps';

const baseClasses = 'text-3xl';

function getColorAndIconClassNames(
  type: PriorityVisualizationType,
): string | null {
  switch (type) {
    case PriorityVisualizationType.ABOUT_TO_END:
      return `${baseClasses} text-hsl-red icon-alert`;

    case PriorityVisualizationType.TEMPORARY:
      return `${baseClasses} text-city-bicycle-yellow icon-temporary-alt`;

    case PriorityVisualizationType.DRAFT:
      return `${baseClasses} text-light-grey icon-draft`;

    default:
      return `${baseClasses} text-light-grey icon-placeholder-dot`;
  }
}

export const PriorityIcon: FC<SubComponentProps> = ({ type }) => (
  <span
    className={twJoin('mt-2 self-start', getColorAndIconClassNames(type))}
  />
);
