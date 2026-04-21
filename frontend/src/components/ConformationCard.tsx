import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.ts';
import { SelectableCard } from './RingCard.tsx';
import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import MoleculeWithFallback from './MoleculeWithFallback.tsx';
import { RingType } from '../data/dataTypes.ts';

interface ConfCardProps {
  name: string;
  count: number;
  handleCardClick: () => void;
  isSelected: boolean;
  disabled: boolean;
  ring: RingType;
  favorable: boolean;
}

//TODO: move to types later if needed
const homocycles = ["Cyclohexane", "Benzene", "Cyclopentane"] as const;
type Homocycle = typeof homocycles[number];

function isHomoCycle(ring: RingType): ring is Homocycle {
  return homocycles.includes(ring as Homocycle);
}


export const ConformationCard: React.FC<ConfCardProps> = ({
  name,
  count,
  handleCardClick,
  isSelected,
  disabled,
  ring,
  favorable,
}) => {
  const mainColor = favorable ? '#2587E2' : '#CD4139';
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
          {isHomoCycle(ring) ? <MoleculeWithFallback modelPath={`assets/geometry/${ring}/${ring}-${name}.glb`} /> : null}
          
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
    </SelectableCard>
  );
};
