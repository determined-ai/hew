import { flip, size } from '@floating-ui/dom';
import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';
import {
  AutocompleteChangeReason,
  AutocompleteGroupedOption,
  createFilterOptions,
  FilterOptionsState,
  useAutocomplete,
} from '@mui/base/useAutocomplete';
import { DefaultOptionType } from 'antd/es/select';
import { eqStrict } from 'fp-ts/Eq';
import { difference } from 'fp-ts/Set';
import useOptions from 'rc-select/es/hooks/useOptions'; //
import { FC, forwardRef, Fragment, PropsWithChildren, useCallback, useMemo } from 'react';

import Icon from './Icon';
import { ensureArray } from './internal/functions';
import { SelectProps, SelectValue } from './Select';
import css from './Select.mui.module.scss';
import { useTheme } from './Theme';

export const Select: FC<PropsWithChildren<SelectProps>> = forwardRef(
  ({
    allowClear,
    attachDropdownToContainer,
    autoFocus,
    children,
    defaultValue,
    disableTags,
    disabled,
    dropdownMatchSelectWidth,
    filterOption,
    filterSort,
    id,
    label,
    loading,
    mode,
    onBlur,
    onChange,
    onDeselect,
    onSearch,
    onSelect,
    options,
    placeholder,
    searchable = true,
    value,
    onDropdownVisibleChange,
    optionLabelProp,
  }) => {
    const { themeSettings } = useTheme();
    // mushing the rc-select data format into the mui data format
    const childrenAsData = !!(!options && children);
    // source: https://github.com/react-component/select/blob/master/src/utils/valueUtil.ts#L23-L33
    const fieldNames = useMemo(() => {
      const mergedLabel = childrenAsData ? 'children' : 'label';
      return {
        groupLabel: mergedLabel,
        label: mergedLabel,
        options: 'options',
        value: 'value',
      };
    }, [childrenAsData]);
    /* eslint-disable @typescript-eslint/no-explicit-any -- rc-select types are broken */
    let { options: mergedOptions } = useOptions<DefaultOptionType>(
      options as any,
      children,
      fieldNames,
      undefined as any,
      optionLabelProp as any,
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const grouped = mergedOptions.some((o) => !!o.children);
    const filterOptions =
      filterOption === true
        ? createFilterOptions<DefaultOptionType>()
        : typeof filterOption === 'function'
        ? (options: DefaultOptionType[], { inputValue }: FilterOptionsState<DefaultOptionType>) =>
            options.filter((o) => filterOption(inputValue, o))
        : (options: DefaultOptionType[]) => options;
    if (filterSort) {
      mergedOptions = mergedOptions.sort(filterSort);
    }
    if (grouped) {
      mergedOptions = mergedOptions.flatMap((o) =>
        o.children
          ? o.children.map((c) => ({
              groupLabel: o.label,
              groupValue: o.value || o.label,
              key: c.key,
              label: c.label,
              value: c.value,
            }))
          : [o],
      );
    }
    const mergedOptionsByValue = useMemo(() => {
      return mergedOptions.reduce((acc, o) => {
        acc.set(o.value, o);
        return acc;
      }, new Map());
    }, [mergedOptions]);

    const valueToOption =
      value && mode
        ? ensureArray(value).map((v) => mergedOptionsByValue.get(v))
        : mergedOptionsByValue.get(value);
    const defaultValueToOption =
      defaultValue && mode
        ? ensureArray(defaultValue).map((v) => mergedOptionsByValue.get(v))
        : mergedOptionsByValue.get(defaultValue);

    const onInputChange = useCallback((_: unknown, value: string) => onSearch?.(value), [onSearch]);
    const wrappedOnChange = useCallback(
      (
        _: unknown,
        newValue: DefaultOptionType | DefaultOptionType[] | null,
        reason: AutocompleteChangeReason,
      ) => {
        if (!newValue) {
          onChange?.(undefined, []);
          return;
        }
        const values = ensureArray(newValue);
        if (!mode) {
          onChange?.(values[0].value as SelectValue, values[0]);
          return;
        }
        const newValues = values.map((o) => o.value as SelectValue);
        const newValueSet = new Set(newValues);
        const existingValueSet = new Set(ensureArray(value));
        if (reason === 'selectOption') {
          const addedValues = difference(eqStrict)(newValueSet, existingValueSet);
          const addedValue = [...addedValues][0];
          onSelect?.(addedValue as SelectValue, mergedOptionsByValue.get(addedValue));
        }
        if (reason === 'removeOption') {
          const removedValues = difference(eqStrict)(existingValueSet, newValueSet);
          const removedValue = [...removedValues][0];
          onDeselect?.(removedValue as SelectValue, mergedOptionsByValue.get(removedValue));
        }
        onChange?.(newValues as SelectValue, values);
      },
      [mode, value, onChange, onSelect, mergedOptionsByValue, onDeselect],
    );
    const dropdownOpenHandler = (open: boolean) => () => onDropdownVisibleChange?.(open);
    const {
      getTagProps,
      getClearProps,
      getRootProps,
      getInputProps,
      getInputLabelProps,
      getListboxProps,
      getOptionProps,
      popupOpen,
      groupedOptions,
      anchorEl,
      setAnchorEl,
      value: tagValue,
    } = useAutocomplete({
      defaultValue: defaultValueToOption,
      disableClearable: !allowClear,
      disabled: disabled || loading,
      filterOptions,
      groupBy: grouped ? (o) => o.groupLabel : undefined,
      id,
      isOptionEqualToValue: (a, b) => a.value === b.value,
      multiple: !!mode,
      onChange: wrappedOnChange,
      onClose: dropdownOpenHandler(false),
      onInputChange,
      onOpen: dropdownOpenHandler(true),
      openOnFocus: true,
      options: mergedOptions,
      value: valueToOption,
    });
    const tagValueValues = new Set(
      ensureArray(tagValue)
        .filter(<T, >(v: T): v is Exclude<T, null> => !!v)
        .map((v) => v.value || v.label),
    );
    const inputProps = getInputProps();
    const wrappedOnBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        inputProps.onBlur?.(e);
        onBlur?.();
      },
      [onBlur, inputProps],
    );
    const sizeMiddleware = [
      flip(),
      size({
        apply({ rects, elements }) {
          if (dropdownMatchSelectWidth) {
            const width =
              dropdownMatchSelectWidth === true ? rects.reference.width : dropdownMatchSelectWidth;
            Object.assign(elements.floating.style, {
              width: `${width}px`,
            });
          }
        },
      }),
    ];
    return (
      <>
        <div
          {...getRootProps()}
          className={[css.root, themeSettings.className].join(' ')}
          ref={setAnchorEl}>
          <label {...getInputLabelProps()}>{label}</label>
          <div className={css.input}>
            {tagValue &&
              mode &&
              !disableTags &&
              (tagValue as DefaultOptionType[]).map((t, index) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTagProps({ index })} className={css.tag}>
                  {t.label}
                </span>
              ))}
            {tagValue && mode && disableTags && (
              <div className={css.valueCount}>
                {tagValue.length === options?.length ? 'All' : `${tagValue.length} selected`}
              </div>
            )}
            <input
              {...inputProps}
              autoFocus={autoFocus}
              placeholder={placeholder}
              onBlur={wrappedOnBlur}
              onChange={searchable ? inputProps.onChange : undefined}
            />
            {allowClear && <button {...getClearProps()}>x</button>}
          </div>
        </div>
        {anchorEl && (
          <Popup
            anchor={anchorEl}
            className={themeSettings.className}
            disablePortal={attachDropdownToContainer}
            middleware={sizeMiddleware}
            open={popupOpen}>
            <ul {...getListboxProps()} className={css.listbox}>
              {groupedOptions.map((option, index) => {
                if ('group' in option) {
                  return (
                    <Fragment key={option.key}>
                      <li className={css.groupTitle} key={option.key}>
                        {option.group}
                      </li>
                      <li className={css.group}>
                        <ul>
                          {(option as AutocompleteGroupedOption<DefaultOptionType>).options.map(
                            (o, idx) => (
                              // eslint-disable-next-line react/jsx-key
                              <li {...getOptionProps({ index: option.index + idx, option: o })}>
                                {tagValueValues.has(o.value || o.label) && (
                                  <Icon decorative name="checkmark" />
                                )}
                                <span>{o.label}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </li>
                    </Fragment>
                  );
                }
                return (
                  // eslint-disable-next-line react/jsx-key
                  <li {...getOptionProps({ index, option })}>
                    {tagValueValues.has(option.value || option.label) && (
                      <Icon decorative name="checkmark" />
                    )}
                    <span>{option.label}</span>
                  </li>
                );
              })}
            </ul>
          </Popup>
        )}
      </>
    );
  },
);
