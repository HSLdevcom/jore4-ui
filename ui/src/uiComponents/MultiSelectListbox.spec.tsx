import { fireEvent, screen } from '@testing-library/react';
import { render } from '../utils/test-utils';
import { MultiSelectListbox } from './MultiSelectListbox';

describe('<MultiSelectListbox />', () => {
  const testId = 'multiselectlistbox';
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

    // dropdown is collapsed
    expect(screen.queryByTestId(`${testId}::ListboxOptions`)).toBeNull();

    // click dropdown to open it
    const openDropdownButton = screen.getByTestId(`${testId}::ListboxButton`);
    fireEvent.click(openDropdownButton);

    // dropdown is open
    const dropdownMenu = screen.getByTestId(`${testId}::ListboxOptions`);
    expect(dropdownMenu).toHaveTextContent('label1');
    expect(dropdownMenu).toHaveTextContent('label2');

    // click dropdown to close it
    fireEvent.click(openDropdownButton);

    expect(screen.queryByTestId(`${testId}::ListboxOptions`)).toBeNull();
  });
  // TODO: Add at least a test for selecting a value
});
