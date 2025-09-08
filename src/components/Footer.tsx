import { Box, Link, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#ffffff', color: 'white', py: 6, mt: 6 }}>
      {/* Main footer container */}
      <Box
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src= "/images/elixirlogo.png" alt="Elixir Logo" />
        <Typography variant="body2" align="center" sx={{ color: 'gray', my: 2}}>
          RingWeb tool is a part of services provided by ELIXIR – European research infrastructure
          for biological information. For other services provided by ELIXIR's Czech Republic Node
          visit{' '}
          <Link href="https://www.elixir-czech.cz/services" target="_blank" rel="noopener" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
            www.elixir-czech.cz/services
          </Link>
          .
        </Typography>
      </Box>

      {/* Footer Text */}
      <Box sx={{ textAlign: 'center', my: 4, color: 'gray' }}>
        <Typography variant="body2">© 2025 RingWeb. <Link href="https://webchem.ncbr.muni.cz/Platform/Home/TermsOfUse" target="_blank" rel="noopener" sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>Terms of Use & GDPR</Link>.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
