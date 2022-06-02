import React from 'react';

import Banner from './components/Banner';
import AutoComplete, { DataItem } from './components/AutoComplete';
import './App.css';
import users from './users.json';

function App() {
  const getData = (query: string): Promise<DataItem[]> => {
    return new Promise((resolve) => {
      const filteredUsersByName = users.users.filter(({ firstName, lastName, maidenName }) => {
        const chunks = query.split(' ').map((chunk) => chunk.toLowerCase());

        return chunks.some((chunk) => {
          return firstName.toLowerCase().indexOf(chunk) > -1
            || lastName.toLowerCase().indexOf(chunk) > -1
            || maidenName.toLowerCase().indexOf(chunk) > -1
        });
      }).map(({ firstName, lastName, id }) => ([
        firstName + ' ' + lastName,
        id,
      ]));

      // Getting unique user names
      const finalData: DataItem[] = [];
      const dataMap = new Map(filteredUsersByName as [number, string][]);
      
      dataMap.forEach((id, name) => {
        finalData.push({
          data: name,
          id,
        });
      });

      setTimeout(() => {
        resolve(finalData.slice(0, 15));
      }, 200);
    });
  }

  return (
    <div className="App">
      <Banner title="Header" />
      <AutoComplete getData={getData} />
      <Banner title="Header" placement="bottom" />
    </div>
  );
}

export default App;
