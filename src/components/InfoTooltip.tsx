import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#ffffff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    padding: '16px',
  },
}));

export const InfoTooltip = () => {
  return (
    <div>
      <HtmlTooltip
        placement="right"
        title={
          <React.Fragment>
            <Typography color="inherit">Reset all slider filters</Typography>
            {'N/A values are filtered out from the table if you applied any slider filter.'}
          </React.Fragment>
        }
      >
        <IconButton>
          <RestartAltIcon fontSize="large" />
        </IconButton>
      </HtmlTooltip>
    </div>
  );
};
