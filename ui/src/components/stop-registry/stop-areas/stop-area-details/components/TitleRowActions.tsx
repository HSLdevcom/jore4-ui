import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { twJoin } from 'tailwind-merge';
import { EnrichedStopPlace } from '../../../../../types';
import {
  AlignDirection,
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../../../uiComponents';
import { useUpsertStopArea } from '../../../../forms/stop-area';
import { ShowOnMap } from '../../../search/components/StopPlaceSharedComponents/ActionMenu/ShowOnMap';
import { DeleteStopArea, useStopAreaDeletion } from '../hooks/DeleteStopArea';

const testIds = {
  actionMenu: 'StopAreaTitleRow::actionMenu',
  delete: 'StopAreaTitleRow::delete',
  showOnMap: 'StopAreaTitleRow::showOnMap',
};

type TitleRowActionsProps = {
  readonly className?: string;
  readonly area: EnrichedStopPlace;
  readonly showOnMap: () => void;
};

export const TitleRowActions: FC<TitleRowActionsProps> = ({
  className,
  area,
  showOnMap,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isConfirmDeleteDialogOpen, openDeleteDialog, closeDeleteDialog } =
    useStopAreaDeletion();
  const { defaultErrorHandler } = useUpsertStopArea();

  const onDeleteSuccess = () => {
    navigate('/stop-registry');
  };

  return (
    <>
      <SimpleDropdownMenu
        className={className}
        buttonClassName={twJoin(
          'flex h-11 w-11 items-center justify-center border border-grey',
          'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
        )}
        tooltip={t('accessibility:common.actionMenu')}
        alignItems={AlignDirection.Left}
        testId={testIds.actionMenu}
        disabled={!area}
      >
        <SimpleDropdownMenuItem
          text={t('stopArea.delete')}
          onClick={openDeleteDialog}
          testId={testIds.delete}
        />
        <ShowOnMap
          key="showOnMap"
          onClick={showOnMap}
          testId={testIds.showOnMap}
          text={t('stopRegistrySearch.stopAreaRowActions.showOnMap')}
        />
      </SimpleDropdownMenu>

      <DeleteStopArea
        stopArea={area}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDeleteSuccess={onDeleteSuccess}
        defaultErrorHandler={defaultErrorHandler}
      />
    </>
  );
};
