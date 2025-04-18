import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { formatNumber } from '../helperFunctions/helpers.ts';
import { SelectableCard } from './RingCard.tsx';
import { RotatingMolecule } from './RotatingMolecule.tsx';
import Box from '@mui/material/Box';
import { Chip } from '@mui/material';

interface ConfCardProps {
  name: string;
  count: number;
  handleCardClick: () => void;
  isSelected: boolean;
  disabled: boolean;
  ring: string;
  favorable: boolean;
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
            label={favorable ? 'favorable' : 'unfavorable'}
            size="small"
            variant="outlined"
            sx={{ borderColor: mainColor, color: mainColor }}
          />
        </Box>
        <Box sx={{ height: 260 }}>
          <RotatingMolecule modelPath={`/geometry/${ring}/${ring}-${name}.glb`} />
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
