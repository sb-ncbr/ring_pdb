import { Alert, AlertTitle } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReplayIcon from '@mui/icons-material/Replay';

interface CalloutProps {
  type: 'info' | 'warning' | 'reset';
  title?: string;
  children: React.ReactNode;
}

const icons = {
  info: <InfoIcon fontSize="inherit" />,
  warning: <WarningAmberIcon fontSize="inherit" />,
  reset: <ReplayIcon fontSize="inherit" />,
};

const titles = {
  info: 'Note',
  warning: 'Warning',
  reset: 'Tip',
};

export const Callout = ({ type, title, children }: CalloutProps) => (
  <Alert
    icon={icons[type]}
    severity={type === 'reset' ? 'info' : type}
    sx={{ mt: 2, mb: 2 }}
  >
    <AlertTitle>{title ?? titles[type]}</AlertTitle>
    {children}
  </Alert>
);
