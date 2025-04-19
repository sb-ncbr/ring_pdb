import { Typography } from '@mui/material';
import React from 'react';
import TableMRT from '../components/TableMRT';

export const TablePage: React.FC = () => {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          margin: '24px',
          textAlign: 'left',
          color: '#3A3A3A',
        }}
      >
        {/*Table name*/}
      </Typography>
      <TableMRT />
    </>
  );
};
