import { FC } from 'react';
import { StopSelectionInfoFragment as StopSelectionInfo } from '../../../generated/graphql';
import { Priority } from '../../../types/enums';
import { CloseIconButton } from '../../../uiComponents';

const testIds = {
  stop: (
    publicCode: string | null | undefined,
    priority: string | null | undefined,
  ) =>
    `Map::StopSelection::Stop::${publicCode ?? ''}${priority ? `-${priority}` : ''}`,
  removeButton: 'Map::StopSelection::RemoveSelection',
};

const baseIconClasses = `text-3xl min-w-[48px] flex justify-center items-center`;

const knownPriorityIconsClasses: Readonly<Record<string, string>> = {
  [Priority.Temporary]: `${baseIconClasses} text-city-bicycle-yellow icon-temporary-alt`,
  [Priority.Draft]: `${baseIconClasses} text-light-grey icon-draft`,
  [Priority.Standard]: `${baseIconClasses} text-light-grey icon-placeholder-dot`,
};

function getPriorityIconClasses(rawPriority?: string | null): string {
  if (rawPriority) {
    return knownPriorityIconsClasses[rawPriority] ?? baseIconClasses;
  }

  return baseIconClasses;
}

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
    className="flex border-b border-light-grey p-2"
    data-testid={testIds.stop(stop.public_code, stop.priority)}
  >
    <div className={getPriorityIconClasses(stop.priority)} />
    <div className="ml-2 flex flex-grow flex-col">
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
