import { fireEvent, screen } from '@testing-library/react';
import { render } from '../utils/test-utils';
import { MultiSelectListbox } from './MultiSelectListbox';

describe('<MultiSelectListbox />', () => {
  const testId = 'multiselectlistbox1';
  const buttonContent = `button`;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onBlur = () => {};
  const options = [
    { key: 'option1', value: 'value1', render: () => 'label1' },
    { key: 'option2', value: 'value2', render: () => 'label2' },
  ];

  test('Opens dropdown when clicked', async () => {
    render(
      <MultiSelectListbox
        testId={testId}
        buttonContent={buttonContent}
        onChange={onChange}
        onBlur={onBlur}
        options={options}
      />,
    );

    // dropdown is collapsed:
    expect(screen.queryByText('button')).toBeVisible();
    expect(screen.queryByText('label1')).toBeNull();

    // click dropdown to open it:
    const openDropdownButton = screen.getByTestId(testId);
    fireEvent.click(openDropdownButton);

    // dropdown is open:
    expect(screen.queryByText('button')).toBeVisible();
    expect(screen.queryByText('label1')).toBeVisible();
  });
  // TODO: Add at least a test for selecting a value
});
