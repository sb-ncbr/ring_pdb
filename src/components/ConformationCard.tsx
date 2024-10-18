import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.ts';
import { SelectableCard } from './RingCard.tsx';
import { RotatingMolecule } from './RotatingMolecule.tsx';
import Box from '@mui/material/Box';

interface RingCardProps {
  name: string;
  count: number;
  handleCardSelect: () => void;
  isSelected: boolean;
  // disabled: boolean;
  ring: string;
}

export const ConformationCard: React.FC<RingCardProps> = ({
  name,
  count,
  handleCardSelect,
  isSelected,
  // disabled,
  ring,
}) => {
  return (
    <SelectableCard selected={isSelected} sx={{ maxWidth: 325 }}>
      <CardActionArea onClick={handleCardSelect}>
        <Box sx={{ height: 300 }}>
          {name === 'All conformations' ? null : (
            <RotatingMolecule modelPath={`/static/geometry/${ring}/${ring}-${name}.glb`} />
          )}
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatNumber(count)} rings
          </Typography>
        </CardContent>
      </CardActionArea>
    </SelectableCard>
  );
};
