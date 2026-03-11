import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, IconButton, Popover } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const description = 'N/A values are filtered out from the table if you applied any slider filter.';

export const InfoTooltip = ({ onResetSlider }: { onResetSlider: any }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleInfoClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onResetSlider}>
          <RestartAltIcon />
        </IconButton>
        <Typography
          variant="caption"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          Reset all slider filters
        </Typography>
        <IconButton
          size="small"
          onClick={handleInfoClick}
          sx={{
            p: 1,
            transform: 'translateY(-4px)',
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, maxWidth: 280 }}>
            <Typography variant="body2">{description}</Typography>
          </Box>
        </Popover>
      </Box>
    </div>
  );
};
