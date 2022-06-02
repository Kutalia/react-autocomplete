import React, { useState, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';

import useWindowResize, { ScreenSizes } from '../../hooks/useWindowResize';
import { debounce } from '../../utils/common';
import './AutoComplete.css';

export interface DataItem {
  data: string | number;
  id?: React.Key;
}

interface PropTypes {
  getData: (query: string) => Promise<DataItem[]>;
}

const AutoComplete: React.FC<PropTypes> = ({ getData }) => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [query, setQuery] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
  const [autoCompleteEl, setAutoCompleteEl] = useState<HTMLDivElement | null>(null);
  const windowSize = useWindowResize();

  const debouncedQuery = useCallback(debounce((value: string) => {
    setQuery(value);
  }, 1000), []);

  useEffect(() => {
    const searchStr = query?.trim();

    if (searchStr) {
      getData(searchStr).then((data) => {
        setItems(data);
      });
    }
  }, [query]);

  useEffect(() => {
    debouncedQuery(text);
  }, [text]);

  useLayoutEffect(() => {
    if (inputEl && autoCompleteEl) {
      autoCompleteEl.style.top = `${inputEl.clientHeight}px`;
    }
  }, [inputEl, autoCompleteEl]);

  useEffect(() => {
    function handler(e: UIEvent) {
      if (e.target !== inputEl) {
        setIsOpen(false);
      }
    }

    if (inputEl) {
      window.addEventListener('click', handler);

      return () => window.removeEventListener('click', handler);
    }
  }, [inputEl]);

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    const { value } = e.target;
    setText(e.target.value);
    setIsOpen(!!value);
  }, []);

  const getItemProps = useCallback(({ data, id }: DataItem, index: number) => ({
    key: id ?? index,
    onClick: () => {
      setQuery(String(data));
      setIsOpen(false);
    },
    children: data,
  }), []);

  const mobileMenu = <div className="autocomplete__menu" ref={setAutoCompleteEl}>
    {items.map((item, index) => (
      <div
        {...getItemProps(item, index)}
      />
    ))}
  </div>;

  const columns = 3;

  const tableRows = useMemo(() => {
    const rowElements: JSX.Element[] = [];

    if (windowSize !== ScreenSizes.DESKTOP) {
      return rowElements;
    }

    const rows = Math.ceil(items.length / columns);

    return Array(rows).fill(null).map((_, row) => (
      <tr key={row}>{Array(columns).fill(null).map((_, column) => {
        const index = row * columns + column
        const item = items[index];

        if (!item) {
          return null;
        }

        return (
          <td {...getItemProps(item, index)}>{item.data}</td>
        );
      })}</tr>
    ));
  }, [windowSize, items, getItemProps]);

  const desktopMenu = <table className="autocomplete__menu" ref={setAutoCompleteEl}>
    <tbody>
      {tableRows}
    </tbody>
  </table>;

  return (
    <div className="autocomplete">
      <input
        ref={setInputEl}
        value={text}
        placeholder="Enter user name"
        onClick={() => query && setIsOpen(true)}
        onChange={handleChange}
      />
      {isOpen && text && !!items.length && (windowSize === ScreenSizes.DESKTOP
        ? desktopMenu
        : mobileMenu)
      }
    </div>
  );
};

export default AutoComplete;
