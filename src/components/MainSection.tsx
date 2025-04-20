import React from 'react';
import { Typography } from '@mui/material';

export const MainSection: React.FC<{ section: { header: string; body: any[] } }> = ({
  section,
}) => {
  const { header, body } = section;
  return (
    <>
      <Typography
        variant="h3"
        component="div"
        sx={{
          width: '100%',
          margin: '16px 0',
          textAlign: 'left',
        }}
      >
        {header}
      </Typography>

      <Typography
        variant="body1"
        component="div"
        sx={{
          width: '100%',
          margin: '16px 0',
          textAlign: 'left',
        }}
      >
        {body.map((item: any, index: number) => (
          <div key={index}>
            {item.para && <p>{item.para}</p>}
            {item.listItem && <li>{item.listItem}</li>}
          </div>
        ))}
      </Typography>
    </>
  );
};

export default MainSection;
