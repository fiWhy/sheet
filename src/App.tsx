import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import styles from './App.scss';
import Sheet from './components/Sheet';
import { DataProvider } from './providers/data';

function App() {
  return (
    <div className={styles.App}>
      <DataProvider storageKey={'data'} columns={30} rows={100}>
        <HashRouter>
          <Routes>
            <Route path={'/:payload'} element={<Sheet />} />
            <Route path={'/'} element={<Sheet />} />
          </Routes>
        </HashRouter>
      </DataProvider>
    </div>
  );
}

export default App;
