import { Box, Link, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';

const Footer = () => {
  return (
    <>
      <Divider sx={{ mt: 6 }} />
      <Box sx={{ backgroundColor: '#ffffff', color: 'white', py: 3, px: 3 }}>
        {/* Footer Text */}
        <Box sx={{ textAlign: 'right', color: 'gray' }}>
          <Typography variant="body2">
            © 2026 RingWeb.{' '}
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
