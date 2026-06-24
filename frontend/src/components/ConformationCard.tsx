import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { Button, CardActions, Chip, Tooltip } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { formatNumber } from '../helperFunctions/helpers.tsx';
import { SelectableCard } from '../helperFunctions/stylers.ts';
import MoleculeWithFallback from './MoleculeWithFallback.tsx';
import { RingType, HomocycleType } from '../data/dataTypes.ts';
import { DetailedConfsDialog } from './RingsStepper/DetailedConfsDialog.tsx';
import { cardTooltipSx } from '../helperFunctions/stylers.ts';

interface ConfCardProps {
  name: string;
  count: number;
  handleCardClick: () => void;
  isSelected: boolean;
  disabled: boolean;
  ring: RingType;
  favorable: boolean;
  subtypes:
    | {
        name: string;
        count: number;
      }[]
    | [];
}

function isHomocycle(ring: RingType): ring is HomocycleType {
  return ['Cyclohexane', 'Benzene', 'Cyclopentane'].includes(ring);
}

export const ConformationCard: React.FC<ConfCardProps> = ({
  name,
  count,
  handleCardClick,
  isSelected,
  disabled,
  ring,
  favorable,
  subtypes,
}) => {
  const mainColor = favorable ? '#2587E2' : '#CD4139';
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SelectableCard selected={isSelected} sx={{ maxWidth: 325 }}>
      <CardActionArea onClick={handleCardClick} disabled={disabled}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '16px' }}>
          <Chip
            label={
              <Typography variant="body1">{favorable ? 'favorable' : 'unfavorable'}</Typography>
            }
            size="small"
            variant="outlined"
            sx={{ borderColor: mainColor, color: mainColor }}
          />
        </Box>
        <Box sx={{ height: 220 }}>
          <MoleculeWithFallback modelPath={`assets/geometry/${ring}/${ring}-${name}.glb`} />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="subtitle1" component="div">
            {name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {formatNumber(count)} rings
          </Typography>
        </CardContent>
      </CardActionArea>
      {!isHomocycle(ring) && name !== 'Flat' ? (
        <CardActions>
          <Tooltip
            title="View puckering states"
            slotProps={{
              tooltip: {
                sx: cardTooltipSx,
              },
            }}
          >
            <Button variant="text" onClick={handleClickOpen}>
              <QueryStatsIcon sx={{ mr: 1, color: 'primary.main' }} />
            </Button>
          </Tooltip>
          <DetailedConfsDialog
            open={open}
            onClose={handleClose}
            mainConf={name}
            confs={Array.from(subtypes)}
          />
        </CardActions>
      ) : null}
    </SelectableCard>
  );
};
