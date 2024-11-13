import { theme } from '../../../generated/theme';

const testIds = {
  mapPlaceholder: 'LineMissingBox::mapPlaceholder',
};
const { colors } = theme;

const border = `border border-light-grey`;

const mapIconStyle = {
  color: colors.background.grey,
  'font-size': '10.3125rem',
};
export const LineDetailsEmptyMapPlaceholder = () => {
  return (
    <div
      data-testid={testIds.mapPlaceholder}
      className={`flex h-72 w-full flex-shrink-0 items-center justify-center ${border}`}
    >
      <i className="icon-map-1 self-center" style={mapIconStyle} />
    </div>
  );
};
