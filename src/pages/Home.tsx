import React from "react";
import Stack from '@mui/material/Stack';
import { Box } from "@mui/material";
import ActionCard from "../components/ActionCard";
import MainSection from "../components/MainSection";
import ExampleCard from "../components/ExampleCard";

import cards from "../content/cards.json"
import sections from "../content/main.json"


export const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        maxWidth: '1300px',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px',
        margin: '24px auto'
      }}
    >
      <MainSection section={sections.first} />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
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

      <MainSection section={sections.second} />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap="24px"
        sx={{
          justifyContent: "center",
          margin: '16px 0'
        }}
      >
        {cards["example-cards"].map((card, index) => (
          <ExampleCard key={index} {...card} />
        ))}
      </Stack>
    </Box>
  );
};
