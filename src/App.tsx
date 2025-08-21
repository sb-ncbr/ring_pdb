/* eslint-disable no-unused-vars */
import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Layout } from './Layout.tsx';
import { Home } from './pages/Home.tsx';
import { UserGuide } from './pages/UserGuide.tsx';
import { TablePage } from './pages/TablePage.tsx';
import RingDetailsWrapper from './pages/RingDetails.tsx';
import { RingsStepperPage } from './pages/RingsStepperPage.tsx';
import { GlobalStyles } from '@mui/material';
import NotFoundPage from './pages/NotFoundPage.tsx';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          html: {
            width: '100%',
            height: '100%',
          },
          body: {
            width: '100%',
            height: '100%',
          },
        }}
      />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="user-guide" element={<UserGuide />} />
              <Route path="data" element={<TablePage />} />
              <Route path="browse-conformations" element={<RingsStepperPage />} />
              <Route path="ring-details/:ringID" element={<RingDetailsWrapper />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
    </ThemeProvider>
  );
};

export default App;
