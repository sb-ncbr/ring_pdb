import React from 'react';
import { Box } from '@mui/material';
import ActionCard from '../components/ActionCard';
import ExampleCard from '../components/ExampleCard';
import Divider from '@mui/material/Divider';
import cards from '../content/cards.json';
import Stack from '@mui/material/Stack';
import { MainSection } from '../components/MainSection.tsx';
import Heading from '../components/Heading.tsx';

interface SectionProps {
  children: React.ReactNode;
  background?: string; // can be color or gradient
  blur?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, background, blur }) => (
  <Box
    sx={{
      width: '100%',
      background,
      backdropFilter: blur ? 'blur(10px)' : undefined,
      WebkitBackdropFilter: blur ? 'blur(10px)' : undefined,
      py: 3,
    }}
  >
    <Box sx={{ maxWidth: '1300px', mx: 'auto', px: 2 }}>{children}</Box>
  </Box>
);

const isValidId = (id: unknown): id is 'pdb' | 'ccd' | undefined => {
  return id === 'pdb' || id === 'ccd' || id === undefined;
};

export const Home: React.FC = () => (
  <Box>
    <Section background="#ffffff">
      <MainSection />
    </Section>

    <Section background="#ffffff" blur>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap="24px"
        justifyContent="center"
        alignItems="stretch"
      >
        {cards['action-cards'].map((card, index) => {
          const id = isValidId(card.idType) ? card.idType : undefined;
          return <ActionCard key={index} {...card} idType={id} />;
        })}
      </Stack>
    </Section>
    <Divider sx={{ mt: 6 }} />
    <Section background="#ffffff">
      <Heading text="Examples"/>
    </Section>

    <Section background="#ffffff" blur>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap="24px" justifyContent="center">
        {cards['example-cards'].map((card, index) => (
          <ExampleCard key={index} {...card} />
        ))}
      </Stack>
    </Section>
  </Box>
);
