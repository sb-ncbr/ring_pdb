import React from "react";
import Stack from '@mui/material/Stack';
import { Box, Typography } from "@mui/material";
import ActionCard from "../components/ActionCard";
import cards from "../content/cards.json"
import sections from "../content/main.json"


export const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        maxWidth: '1000px',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'auto',
        padding: '0 16px',
        margin: '24px auto'
      }}
    >
      <Typography variant="h4" component="div" sx={{
        width: '100%',
        margin: '16px 0',
        textAlign: 'left'
      }}
      >
        {sections.first.header}
      </Typography>

      <Typography variant="body2" component="div" sx={{
        width: '100%',
        margin: '16px 0',
        textAlign: 'left'
      }}
      >
        {sections.first.body}
      </Typography>

      <Stack
        direction="row"
        gap="24px"
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
          margin: '16px 0'
        }}
      >
        {cards["action-cards"].map((card, index) => (
          <ActionCard key={index} {...card} />
        ))}
      </Stack>
    </Box>
  );
};
