import EmailIcon from "@mui/icons-material/Email";
import Button from '@mui/material/Button';

export default function ContactInfo() {
  return (
     <Button
      variant="contained"
      color="info"
      startIcon={<EmailIcon />}
      href="mailto:doshchenko@muni.cz"
      sx={{ color: (theme) => theme.palette.text.secondary }}
    >
      Contact Us
    </Button>
  );
}
