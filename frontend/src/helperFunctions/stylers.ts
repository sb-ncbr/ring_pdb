import { styled } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';

interface SelectableCardProps extends CardProps {
  selected?: boolean;
}

export const SelectableCard: React.ComponentType<SelectableCardProps> = styled(
  Card,
)<SelectableCardProps>(({ theme, selected }) => ({
  transform: selected ? 'translateY(-10px)' : 'none',
  boxShadow: selected ? theme.shadows[24] : theme.shadows[1],
  border: selected ? `1px solid ${theme.palette.primary.main}` : '0',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: selected ? theme.shadows[24] : theme.shadows[6],
  },
  width: 280,
}));

export const cardTooltipSx = {
  bgcolor: 'background.paper',
  color: 'text.primary',
  p: 1.5,
  maxWidth: 280,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.12)',
  fontSize: 13,
};