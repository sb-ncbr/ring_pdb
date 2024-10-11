/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Layout } from './Layout.tsx';
import { Home } from './pages/Home.tsx';
import NoPage from './pages/NoPage.tsx';
import { DataDescription } from './pages/DataDescription.tsx';
import { UserGuide } from './pages/UserGuide.tsx';
import Example from './pages/Example.tsx';
import { TablePage } from './pages/TablePage.tsx';
import RingDetails from './pages/RingDetails.tsx';
import { RingsStepperPage } from './pages/RingsStepperPage.tsx';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="data-description" element={<DataDescription />} />
            <Route path="user-guide" element={<UserGuide />} />
            <Route path="result/example-1" element={<Example example="example-1" />} />
            <Route path="data" element={<TablePage />} />
            <Route path="browse-conformations" element={<RingsStepperPage />} />
            <Route path="ring-details/:ringId" element={<RingDetails />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
