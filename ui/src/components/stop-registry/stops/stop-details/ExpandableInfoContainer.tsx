import { ReactNode } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Visible } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  title: string | ReactNode;
}

export const ExpandableInfoContainer: React.FC<Props> = ({
  isExpanded,
  onToggle,
  title,
  children,
}) => {
  return (
    <div className="[&>*]:border-border-hsl-ferry-10 my-3">
      <div
        className={`
          flex items-center justify-between rounded-t-lg border
          bg-hsl-neutral-blue px-4 py-2 ${isExpanded ? '' : 'rounded-b-lg'}
        `}
      >
        <h4>{title}</h4>
        <div>
          {/* TODO: add other buttons, possibly depending on context. */}
          <SimpleButton onClick={onToggle} inverted={!isExpanded}>
            {isExpanded ? (
              <FaChevronUp className="text-white" aria-hidden />
            ) : (
              <FaChevronDown className="text-tweaked-brand" aria-hidden />
            )}
          </SimpleButton>
        </div>
      </div>
      <Visible visible={isExpanded}>
        <div className="rounded-b-lg border-x border-b p-5 [&>hr]:mt-5">
          {children}
        </div>
      </Visible>
    </div>
  );
};
