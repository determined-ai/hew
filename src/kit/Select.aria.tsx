import { getChildNodes } from '@react-stately/collections';
import { DefaultOptionType } from 'antd/es/select';
import useOptions from 'rc-select/es/hooks/useOptions'; //
import { FC, forwardRef, PropsWithChildren, useMemo, useRef } from 'react';
import {
  AriaListBoxProps,
  Overlay,
  useListBox,
  useListBoxSection,
  useOption,
  usePopover,
  useSearchField,
  useTag,
  useTagGroup,
} from 'react-aria';
import {
  Item,
  ListState,
  Node,
  OverlayTriggerState,
  Section,
  Selection,
  useListState,
  useOverlayTriggerState,
  useSearchFieldState,
} from 'react-stately';

import { ensureArray } from './internal/functions';
import { SelectProps, SelectValue } from './Select';
import { useTheme } from './Theme';
import { isNotNullish } from './utils/functions';

const toKeys = (value?: SelectValue) =>
  value === undefined
    ? value
    : ensureArray(value).map((v) => (typeof v !== 'string' && typeof v !== 'number' ? v.value : v));

function lazyFilter<T, U extends T>(iter: Iterable<T>, fn: (t: T) => t is U): Iterator<U>;
function lazyFilter<T>(iter: Iterable<T>, fn: (t: T) => boolean): Iterator<T>;
function* lazyFilter<T>(iter: Iterable<T>, fn: (t: T) => boolean): Iterator<T> {
  for (const item of iter) {
    if (fn(item)) {
      yield item;
    }
  }
}

const ListOption = <T, >({ item, state }: { item: Node<T>; state: ListState<T> }) => {
  const liRef = useRef<HTMLLIElement>(null);
  const { optionProps, labelProps } = useOption({ key: item.key }, state, liRef);
  return (
    <li {...optionProps} ref={liRef}>
      <span {...labelProps}>{item.rendered}</span>
    </li>
  );
};

const ListSection = <T, >({ item, state }: { item: Node<T>; state: ListState<T> }) => {
  const { itemProps, headingProps, groupProps } = useListBoxSection({ heading: item.rendered });
  const children = getChildNodes(item, state.collection);

  return (
    <li {...itemProps}>
      <div {...headingProps}>{item.rendered}</div>
      <ul {...groupProps}>
        {[...children].map((n) => (
          <ListOption item={n} key={n.key} state={state} />
        ))}
      </ul>
    </li>
  );
};

const Tag = <T, >({ item, state }: { item: Node<T>; state: ListState<T> }) => {
  const tagRef = useRef<HTMLElement>(null);
  const { rowProps, gridCellProps, removeButtonProps } = useTag({ item }, state, tagRef);

  return (
    <div {...rowProps}>
      <div {...gridCellProps}>{item.rendered}</div>
      <button {...removeButtonProps}>x</button>
    </div>
  );
};

const TagGroup = <T, >({ state }: { state: ListState<T> }) => {
  const tagGroupRef = useRef<HTMLDivElement>(null);
  const { gridProps } = useTagGroup({ selectionMode: 'none' }, state, tagGroupRef);

  return (
    <div {...gridProps} ref={tagGroupRef}>
      {[...state.selectionManager.selectedKeys]
        .map(state.collection.getItem)
        .filter(isNotNullish)
        .map((item) => {
          return <Tag item={item} key={item.key} state={state} />;
        })}
    </div>
  );
};

const Popover = ({
  triggerRef,
  state,
  children,
  portalContainer,
}: {
  triggerRef: React.RefObject<HTMLElement>;
  state: OverlayTriggerState;
  children: React.ReactNode;
  portalContainer?: HTMLElement;
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { popoverProps, underlayProps } = usePopover({ popoverRef, triggerRef }, state);

  return (
    <Overlay portalContainer={portalContainer}>
      <div {...underlayProps} />
      <div {...popoverProps} ref={popoverRef}>
        {children}
      </div>
    </Overlay>
  );
};

const ListBox = <T, >({
  listProps,
  listState,
}: {
  listProps: AriaListBoxProps<T>;
  listState: ListState<T>;
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const { listBoxProps } = useListBox(listProps, listState, listRef);

  return (
    <ul {...listBoxProps} ref={listRef}>
      {[...listState.collection].map((node) =>
        node.hasChildNodes ? (
          <ListSection item={node} key={node.key} state={listState} />
        ) : (
          <ListOption item={node} key={node.key} state={listState} />
        ),
      )}
    </ul>
  );
};

export const Select: FC<PropsWithChildren<SelectProps>> = forwardRef(
  ({
    allowClear,
    attachDropdownToContainer,
    autoFocus,
    children,
    defaultValue,
    disableTags,
    disabled,
    filterOption,
    label,
    loading,
    mode,
    onChange,
    onSearch,
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
    const { options: mergedOptions } = useOptions<DefaultOptionType>(
      options as any,
      children,
      fieldNames,
      undefined as any,
      optionLabelProp as any,
    );
    const triggerState = useOverlayTriggerState({ onOpenChange: onDropdownVisibleChange });
    const searchFieldProps = useMemo(() => {
      return {
        autoFocus,
        isDisabled: disabled || loading,
        label,
        onFocusChange: (f: boolean) => triggerState.setOpen(f),
        onSubmit: onSearch,
        placeholder,
        readOnly: !searchable,
      };
    }, [autoFocus, disabled, label, loading, onSearch, placeholder, triggerState, searchable]);
    const searchState = useSearchFieldState(searchFieldProps);
    const optionToItem = (o: DefaultOptionType) => {
      if ('children' in o && o.children) {
        return (
          <Section items={o.children} title={o.label || o.value}>
            {(item) => <Item key={item.value}>{item.label || item.value}</Item>}
          </Section>
        );
      }
      return <Item key={o.value}>{o.label || o.value}</Item>;
    };
    const filter = (
      items: Iterable<Node<DefaultOptionType>>,
    ): Iterable<Node<DefaultOptionType>> => {
      const filterFunc = !filterOption
        ? () => true
        : filterOption === true
        ? (o: Node<DefaultOptionType>) =>
            o?.value?.value?.toString().includes(searchState.value) || false
        : (o: Node<DefaultOptionType>) => filterOption(searchState.value, o.value || undefined);
      // wrapped so we can iterate multiple times
      return {
        [Symbol.iterator]: () => {
          return lazyFilter(items, filterFunc);
        },
      };
    };
    const listProps = {
      children: optionToItem,
      defaultSelectedKeys: toKeys(defaultValue),
      disabledBehavior: 'all' as const,
      filter,
      items: mergedOptions,
      onSelectionChange: (keys: Selection) => {
        const finalKeys = keys === 'all' ? [...listState.collection.getKeys()] : [...keys];
        const options = finalKeys
          .map(listState.collection.getItem)
          .filter(isNotNullish)
          .map((n) => n.value)
          .filter(isNotNullish);
        onChange?.(finalKeys, options);
        searchState.setValue(options[options.length - 1]?.value?.toString() || '');
      },
      selectedKeys: toKeys(value),
      selectionBehavior: mode ? ('toggle' as const) : ('replace' as const),
      selectionMode: mode ? ('multiple' as const) : ('single' as const),
    };
    const listState = useListState(listProps);
    const inputRef = useRef<HTMLInputElement>(null);
    const { labelProps, inputProps, clearButtonProps } = useSearchField(
      searchFieldProps,
      searchState,
      inputRef,
    );
    const selectedKeys = [...listState.selectionManager.selectedKeys];
    const containerRef = useRef<HTMLDivElement>(null);
    return (
      <>
        <div className={themeSettings.className} ref={containerRef}>
          <label {...labelProps}>{label}</label>
          <div>
            {mode && !disableTags && <TagGroup state={listState} />}
            {mode && disableTags && selectedKeys.length > 0 && (
              <div>
                {listState.selectionManager.isSelectAll ? 'All' : `${selectedKeys.length} selected`}
              </div>
            )}
            <input {...inputProps} ref={inputRef} />
            {allowClear && <button {...clearButtonProps}>x</button>}
          </div>
        </div>
        {triggerState.isOpen && (
          <Popover
            portalContainer={
              attachDropdownToContainer ? containerRef.current || undefined : undefined
            }
            state={triggerState}
            triggerRef={inputRef}>
            <ListBox listProps={listProps} listState={listState} />
          </Popover>
        )}
      </>
    );
  },
);
