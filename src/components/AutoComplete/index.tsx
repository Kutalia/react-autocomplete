import React, { useState, useEffect, useLayoutEffect } from 'react';

import useWindowResize, { ScreenSizes } from '../../hooks/useWindowResize';
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
  const [autoCompleteEl, setAutoCompleteEl] = useState<HTMLDivElement | null>(null);
  const windowSize = useWindowResize();

  useEffect(() => {
    const searchStr = query?.trim();

    if (searchStr) {
      getData(searchStr).then((data) => {
        setItems(data);
      });
    }
  }, [query]);

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

  return (
    <div className="autocomplete">
      <input
        ref={setInputEl}
        value={query}
        placeholder="Enter user name"
        onClick={() => query && setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
      />
      {isOpen && !!items.length &&
        <div className="autocomplete__menu" ref={setAutoCompleteEl}>
          {items.map(({ data, id }, index) => (
            <div
              key={id ?? index}
              onClick={() => {
                setQuery(String(data));
                setIsOpen(false);
              }}
            >
              {data}
            </div>
          ))}
        </div>}
    </div>
  );
};

export default AutoComplete;
