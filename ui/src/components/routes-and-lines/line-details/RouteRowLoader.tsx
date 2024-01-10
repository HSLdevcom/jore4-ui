import { PulseLoader } from 'react-spinners';
import { theme } from '../../../generated/theme';

interface Props {
  className?: string;
}

export const RouteRowLoader = ({ className = '' }: Props): JSX.Element => {
  return (
    <tr className={`border border-white bg-lighter-grey ${className} p-4`}>
      <td className="p-4" colSpan={6}>
        <div className="mt-1 inline-flex w-full flex-col items-center">
          <PulseLoader
            size={15}
            color={theme.colors.brand}
            speedMultiplier={0.7}
          />
        </div>
      </td>
    </tr>
  );
};
