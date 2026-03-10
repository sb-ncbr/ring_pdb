import EmailIcon from "@mui/icons-material/Email";
import { Box, Link, Stack, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function ContactInfo() {
  return (
     <Box sx={{ textAlign: 'center', pt: 2}}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Contact
      </Typography>

      <Stack spacing={2} alignItems="start">
        <Link
          href="mailto:doshchenko@muni.cz"
          underline="none"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <EmailIcon fontSize="small" />
          doshchenko@muni.cz
        </Link>

        <Link
          href="https://github.com/sb-ncbr/ring_web"
          target="_blank"
          rel="noopener"
          underline="none"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <GitHubIcon fontSize="small" />
          GitHub repository
        </Link>
      </Stack>
    </Box>
  );
}
