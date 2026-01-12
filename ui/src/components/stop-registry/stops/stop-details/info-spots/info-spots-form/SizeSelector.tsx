import { Listbox, Transition } from '@headlessui/react';
import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
  JoreListboxButton,
  dropdownTransition,
  listboxStyles,
} from '../../../../../../uiComponents';
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
      className={listboxStyles.root(className)}
      disabled={disabled}
      onChange={onChange}
      value={selectedItem}
      data-testid={testId}
    >
      {({ open }) => (
        <>
          <JoreListboxButton id={id} testId={`${testId}::ListboxButton`}>
            {formatOption(t, selectedItem)}
          </JoreListboxButton>

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Listbox.Options
              className={listboxStyles.options()}
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
                        className={listboxStyles.option()}
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
          </Transition>
        </>
      )}
    </Listbox>
  );
};
