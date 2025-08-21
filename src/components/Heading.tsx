import { Typography } from "@mui/material";

interface HeadingProps {
  text: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  sx?: object;
}

const Heading = ({ text, variant = "h3", sx = {width: "100%",
          margin: "16px 0",
          textAlign: "left",} }: HeadingProps) => {
  return (
    <Typography
      variant={variant}
      component="div"
      sx={{ ...sx }}
    >
      {text}
    </Typography>
  );
};

export default Heading;