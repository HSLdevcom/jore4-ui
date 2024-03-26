import { ReactNode } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Visible } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  title: string | ReactNode;
  testIdPrefix?: string;
}

const testIds = {
  toggle: (prefix: string) => `${prefix}::toggle`,
  content: (prefix: string) => `${prefix}::content`,
};

export const ExpandableInfoContainer: React.FC<Props> = ({
  isExpanded,
  onToggle,
  title,
  testIdPrefix = '',
  children,
}) => {
  return (
    <div className="my-3 [&>*]:border-border-hsl-blue">
      <div
        className={`
          flex items-center justify-between rounded-t-lg border
          bg-hsl-neutral-blue px-4 py-2 ${isExpanded ? '' : 'rounded-b-lg'}
        `}
      >
        <h4>{title}</h4>
        <div>
          {/* TODO: add other buttons, possibly depending on context. */}
          <SimpleButton
            onClick={onToggle}
            inverted={!isExpanded}
            testId={testIds.toggle(testIdPrefix)}
          >
            {isExpanded ? (
              <FaChevronUp className="text-white" aria-hidden />
            ) : (
              <FaChevronDown className="text-tweaked-brand" aria-hidden />
            )}
          </SimpleButton>
        </div>
      </div>
      <Visible visible={isExpanded}>
        <div
          data-testid={testIds.content(testIdPrefix)}
          className="rounded-b-lg border-x border-b p-5 [&>hr]:mt-5"
        >
          {children}
        </div>
      </Visible>
    </div>
  );
};
