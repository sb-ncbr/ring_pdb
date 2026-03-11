import { Box, Typography, Stack } from '@mui/material';

interface StatsProps {
  rings: number;
  pdbEntries: number;
  ligands: number;
}

export default function DashboardStats({ rings, pdbEntries, ligands }: StatsProps) {
  const stats = [
    { label: 'Rings analysed', value: rings },
    { label: 'PDB entries', value: pdbEntries },
    { label: 'Ligands', value: ligands },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 5 },
        boxShadow: '0 1px 20px rgba(0,0,0,0.25)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        divider={
          <Box
            sx={{
              width: { xs: '100%', md: '1px' },
              height: { xs: '1px', md: '60px' },
            }}
          />
        }
        spacing={{ xs: 3, md: 6 }}
        justifyContent="space-between"
        alignItems="center"
      >
        {stats.map((stat) => (
          <Box key={stat.label} sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              {stat.value.toLocaleString()}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.85rem',
                opacity: 0.7,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
