import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { formatConformation, formatNumber } from '../../helperFunctions/helpers';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  mainConf: string;
  confs:
    | {
        name: string;
        count: number;
      }[]
    | [];
}

export function DetailedConfsDialog(props: SimpleDialogProps) {
  const { open, onClose, mainConf, confs } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle align="center" sx={{ pb: 0 }}>
        {mainConf}
      </DialogTitle>
      <Grid container alignItems="stretch" spacing={2} p={2}>
        {confs.map((conf) => (
          <Grid size={{ xs: 6, md: 4, lg: 3 }} key={conf.name}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent>
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h6" align="center">
                    {formatConformation(conf.name)}
                  </Typography>

                  <Typography variant="body2">{formatNumber(conf.count)} rings</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Dialog>
  );
}
