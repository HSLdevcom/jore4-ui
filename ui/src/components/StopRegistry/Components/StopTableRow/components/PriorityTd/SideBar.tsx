import { FC } from 'react';
import { twJoin } from 'tailwind-merge';
import { PriorityVisualizationType } from './PriorityVisualizationType';
import s from './SideBar.module.css';
import { SubComponentProps } from './SubComponentProps';

function getBackgroundColor(type: PriorityVisualizationType): string {
  switch (type) {
    case PriorityVisualizationType.ABOUT_TO_END:
      return 'bg-hsl-red';

    case PriorityVisualizationType.TEMPORARY:
      return 'bg-city-bicycle-yellow';

    case PriorityVisualizationType.DRAFT:
      return 'bg-light-grey';

    default:
      return '';
  }
}

const SolidSideBar: FC<SubComponentProps> = ({ type }) => {
  return <div className={twJoin('w-2', getBackgroundColor(type))} />;
};

const DashedSideBar: FC<SubComponentProps> = ({ type }) => {
  return <div className={twJoin('w-2', s.dashed, getBackgroundColor(type))} />;
};

export const SideBar: FC<SubComponentProps> = ({ type }) => {
  if (
    type === PriorityVisualizationType.STANDARD ||
    type === PriorityVisualizationType.UNKNOWN
  ) {
    return <div className="w-2" />;
  }

  if (type === PriorityVisualizationType.TEMPORARY) {
    return <SolidSideBar type={type} />;
  }

  return <DashedSideBar type={type} />;
};
