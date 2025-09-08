import EmailIcon from "@mui/icons-material/Email";
import Button from '@mui/material/Button';

export default function ContactInfo() {
  return (
     <Button
      variant="contained"
      color="info"
      startIcon={<EmailIcon sx={{ color: '#7C7C7C' }}/>}
      href="mailto:doshchenko@muni.cz"
      sx={{ color: '#7C7C7C' }}
    >
      Contact Us
    </Button>
  );
}
