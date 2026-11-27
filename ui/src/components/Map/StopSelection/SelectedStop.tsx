import { FC } from 'react';
import { StopSelectionInfoFragment as StopSelectionInfo } from '../../../generated/graphql';
import { Priority } from '../../../types/enums';
import { CloseIconButton } from '../../common/Buttons';
import { PrioritySymbol } from '../../common/PrioritySymbol';

const testIds = {
  stop: (
    publicCode: string | null | undefined,
    priority: Priority | null | undefined,
  ) =>
    `Map::StopSelection::Stop::${publicCode ?? ''}${priority ? `-${priority}` : ''}`,
  removeButton: 'Map::StopSelection::RemoveSelection',
};

type SelectedStop = {
  readonly linkToDetailsPage: string;
  readonly onRemoveFromSelection: () => void;
  readonly stop: StopSelectionInfo;

  // Avoid calling react hooks in a loop.
  readonly removeButtonTitle: string;
};

export const SelectedStop: FC<SelectedStop> = ({
  linkToDetailsPage,
  onRemoveFromSelection,
  stop,
  removeButtonTitle,
}) => (
  <div
    className="flex p-2"
    data-testid={testIds.stop(stop.public_code, stop.priority)}
  >
    <div className="flex min-w-[48px] items-center justify-center">
      <PrioritySymbol priority={stop.priority} variant="large" />
    </div>
    <div className="ml-2 flex grow flex-col">
      <a
        className="font-bold"
        href={linkToDetailsPage}
        rel="noreferrer"
        target="_blank"
      >
        <span>{stop.public_code}</span>{' '}
        <span>{stop.stop_place?.name_value}</span>
        <i className="icon-open-in-new" aria-hidden />
      </a>

      <p>{stop.street_address}</p>
    </div>

    <CloseIconButton
      className="ml-5"
      title={removeButtonTitle}
      onClick={onRemoveFromSelection}
      testId={testIds.removeButton}
    />
  </div>
);
