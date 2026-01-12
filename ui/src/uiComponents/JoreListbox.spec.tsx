import { screen, waitFor } from '@testing-library/react';
import { fireFullMouseClickSequence, render } from '../utils/test-utils';
import { JoreListbox } from './JoreListbox';

describe('<Listbox />', () => {
  const testId = 'listbox1';
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
      <JoreListbox
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
    fireFullMouseClickSequence(openDropdownButton);

    // dropdown is open
    const dropdownMenu = screen.getByTestId(`${testId}::ListboxOptions`);
    expect(dropdownMenu).toHaveTextContent('label1');
    expect(dropdownMenu).toHaveTextContent('label2');

    // click dropdown to close it
    fireFullMouseClickSequence(openDropdownButton);

    await waitFor(() =>
      expect(
        screen.queryByTestId(`${testId}::ListboxOptions`),
      ).not.toBeInTheDocument(),
    );
  });
});
