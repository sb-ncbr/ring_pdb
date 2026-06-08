import { Box, Link, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';

const Footer = () => {
  return (
    <>
      <Divider sx={{ mt: 6 }} />
      <Box sx={{ backgroundColor: (theme) => theme.palette.background.default, py: 3, px: 3 }}>
        <Box
          sx={{
            textAlign: { xs: 'center', sm: 'right' },
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <Typography variant="body2">
            © 2026 RingPDB.{' '}
            <Link
              href="https://webchem.ncbr.muni.cz/Platform/Home/TermsOfUse"
              target="_blank"
              rel="noopener"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Terms of Use & GDPR
            </Link>
            .
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
