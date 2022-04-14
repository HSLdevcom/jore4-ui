import { useTranslation } from 'react-i18next';
import { MdPinDrop } from 'react-icons/md';
import { useHistory } from 'react-router';
import { RouteLine } from '../../../generated/graphql';
import { useShowRoutesOnModal } from '../../../hooks';
import { mapPriorityToUiName } from '../../../i18n/uiNameMappings';
import { Path, routeDetails } from '../../../router/routeDetails';
import { IconButton, SimpleDropdownMenu } from '../../../uiComponents';

interface Props {
  className?: string;
  line: RouteLine;
}

export const LineDraftTableRow = ({ className, line }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRoutesOnModal } = useShowRoutesOnModal();
  const history = useHistory();

  const showLineRoutes = () => {
    const lineRouteIds = line.line_routes?.map((item) => item.route_id);

    showRoutesOnModal(
      lineRouteIds,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      line.validity_start!,
      line.validity_end,
    );
  };

  const onClickToLineDetails = () => {
    history.push({
      pathname: routeDetails[Path.lineDetails].getLink(line.line_id),
    });
  };
  const commonClassName = 'border p-4';

  return (
    <tbody>
      <tr className={`border ${className}`}>
        <td className="bg-background text-center">
          {mapPriorityToUiName(line.priority)}
        </td>
        <td className={commonClassName}>{line.validity_start?.toISODate()}</td>
        <td className={commonClassName}>{line.validity_end?.toISODate()}</td>
        <td className={commonClassName}>{line.label}</td>
        <td className={commonClassName}>{line.name_i18n}</td>
        <td className={commonClassName}>!14.4.2022 klo 14.34</td>
        <td className={commonClassName}>!Muokkaaja</td>
        <td className={commonClassName}>
          {' '}
          <IconButton
            className="h-full w-full"
            onClick={showLineRoutes}
            icon={<MdPinDrop className="text-5xl text-tweaked-brand" />}
          />
        </td>
        <td className={commonClassName}>
          <SimpleDropdownMenu>
            <button type="button" onClick={onClickToLineDetails}>
              {t('lines.showDraftDetails')}
            </button>
          </SimpleDropdownMenu>
        </td>
      </tr>
    </tbody>
  );
};
