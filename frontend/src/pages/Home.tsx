import React from 'react';
import { Box, Grid2, Link, Typography } from '@mui/material';
import ActionCard from '../components/ActionCard';
import ExampleCard from '../components/ExampleCard';
import Divider from '@mui/material/Divider';
import cards from '../content/cards.json';
import Stack from '@mui/material/Stack';
import { MainSection } from '../components/MainSection.tsx';
import Heading from '../components/Heading.tsx';
import ContactInfo from '../components/ContactInfo.tsx';

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
      <Heading text="Examples" />
    </Section>

    <Section background="#ffffff" blur>
      <Grid2 container spacing={{ xs: 3, sm: 2, xl: 3}} justifyContent="center" >
        {cards['example-cards'].map((card, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: 'flex' }}>
            <ExampleCard {...card} />
          </Grid2>
        ))}
        </Grid2>
    </Section>
    <Divider sx={{ mt: 6 }} />
    <Box
      sx={{
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <img src='assets/images/elixirlogo.png' alt="Elixir Logo" />
      <Typography variant="body2" align="center" sx={{ color: 'gray', mt: 2 }}>
        RingWeb tool is a part of services provided by ELIXIR – European research infrastructure for
        biological information. For other services provided by ELIXIR's Czech Republic Node visit{' '}
        <Link
          href="https://www.elixir-czech.cz/services"
          target="_blank"
          rel="noopener"
          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          www.elixir-czech.cz/services
        </Link>
        .
      </Typography>
    </Box>
    <Box
      sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body2" align="center" sx={{ color: 'gray' }}>
        Licence conditions in accordance with § 11 of Act No. 130/2002 Coll. The owner of the
        software is Masaryk University, a public university, ID: 00216224. Masaryk University allows
        other companies and individuals to use this software free of charge and without territorial
        restrictions in usual way, that does not depreciate its value. This permission is granted
        for the duration of property rights. This software is not subject to special information
        treatment according to Act No. 412/2005 Coll., as amended. In case that a person who will
        use the software under this licence offer violates the licence terms, the permission to use
        the software terminates.
      </Typography>
    </Box>
    <Box
      sx={{
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 3
      }}
    >
      <ContactInfo></ContactInfo>
    </Box>
  </Box>
);
