import { CSSProperties } from 'react';
import { theme } from '../../../generated/theme';

const testIds = {
  mapPlaceholder: 'LineMissingBox::mapPlaceholder',
};
const { colors } = theme;

const mapIconStyle: CSSProperties = {
  color: colors.background.grey,
  fontSize: '10.3125rem',
};
export const LineDetailsEmptyMapPlaceholder = () => {
  return (
    <div
      data-testid={testIds.mapPlaceholder}
      className="flex h-72 w-full shrink-0 items-center justify-center border border-light-grey"
    >
      <i className="icon-map-1 self-center" style={mapIconStyle} />
    </div>
  );
};
