import { Listbox } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ListboxButton } from '../../../../../../uiComponents';
import { ItemSizeState, PosterSizeSubMenu } from '../types';
import { formatOption } from '../utils';

type SizeSelectorProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly onChange: (selectedSize: ItemSizeState) => void;
  readonly subMenus: ReadonlyArray<PosterSizeSubMenu>;
  readonly selectedItem: ItemSizeState;
  readonly testId: string;
};

export const SizeSelector: FC<SizeSelectorProps> = ({
  className,
  disabled = false,
  id,
  onChange,
  subMenus,
  selectedItem,
  testId,
}) => {
  const { t } = useTranslation();

  return (
    <Listbox
      as="div"
      className={twMerge('relative', className)}
      disabled={disabled}
      onChange={onChange}
      value={selectedItem}
      data-testid={testId}
    >
      <ListboxButton
        id={id}
        buttonContent={formatOption(t, selectedItem)}
        hasError={false}
        testId={`${testId}::ListboxButton`}
      />

      <Listbox.Options
        className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
        data-testid={`${testId}::ListboxOptions`}
      >
        {subMenus.map(({ label, options }) => (
          <li key={label}>
            <div className="w-full cursor-default border-b border-grey bg-tweaked-brand px-2 py-2 text-white">
              {label}
            </div>
            <ul>
              {options.map((option) => (
                <Listbox.Option
                  className="cursor-default border-b border-grey py-2 pl-4 pr-2 ui-active:bg-dark-grey ui-active:text-white"
                  key={`${option.uiState}-${option.width}-${option.height}`}
                  value={option}
                >
                  {formatOption(t, option)}
                </Listbox.Option>
              ))}
            </ul>
          </li>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
