import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RingCard } from './RingCard.tsx';

import ringCards from '../content/ringCards.json';
import { ConformationCard } from './ConformationCard.tsx';
import { StepContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const steps = ['Select a ring type', 'Select conformations'];

const StickyButton = styled(Button)(({ theme }) => ({
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  color: '#fff',
  transition: 'transform 0.3s ease-in-out, background-color 0.5s ease',
  animation: 'colorChange 2s forwards',
  backgroundColor: 'transparent',
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  '@keyframes colorChange': {
    '0%': {
      backgroundColor: 'transparent',
    },
    '100%': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default function RingsStepper() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  // const [filterValues, setFilterValues] = useState({ ring: '', confs: new Set() });
  // const [selectedRing, setSelectedRing] = useState({ name: '', index: -1 });
  const [filterValues, setFilterValues] = useState({ ring: null, confs: new Set() });
  const [selectedRing, setSelectedRing] = useState({ name: null, index: null });
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [isStepTwoComplete, setIsStepTwoComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRingSelect = (ring: { name: string; index: number }) => {
    setSelectedRing(ring);
    setFilterValues({ ring: ring.name, confs: new Set() });
    setIsStepTwoComplete(false);
    setShowStickyButton(false);
    if (!selectedRing.index) {
      handleNext();
    }
  };

  const handleConfCardClick = (conf: { name: string; count: number }) => {
    setFilterValues((prevFilterValues) => {
      const confs = prevFilterValues.confs;
      if (confs.has(conf)) {
        confs.delete(conf);
      } else {
        confs.add(conf);
      }
      return {
        ...prevFilterValues,
        confs: confs,
      };
    });
    setIsStepTwoComplete(filterValues.confs.size != 0);
    setShowStickyButton(filterValues.confs.size != 0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1));
  };

  // const isValidName = (name: unknown): name is 'Cyclohexane' | 'Cyclopentane' | 'Benzene' => {
  //   return name === 'Cyclohexane' || name === 'Cyclopentane' || name === 'Benzene';
  // };

  const handleBrowseData = () => {
    setIsLoading(true);
    navigate('/data', {
      state: {
        filters: {
          ring_type: Array(filterValues.ring),
          conformation: {
            selectedValues: Array.from(filterValues.confs),
            showFavorable: true,
            showUnfavorable: true,
          },
        },
      },
    });
  };

  return (
    <Box>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          margin: '32px',
          textAlign: 'center',
        }}
      >
        {/*first step*/}
        <Step key={steps[0]} expanded>
          <StepLabel>
            <Typography variant="h6">{steps[0]}</Typography>
          </StepLabel>
          <StepContent>
            <Stack
              direction="row"
              gap="24px"
              sx={{
                justifyContent: 'center',
                alignItems: 'stretch',
                margin: '16px 0',
              }}
            >
              {ringCards.rings.map((ring, index) => (
                <RingCard
                  key={index}
                  {...ring}
                  handleCardSelect={() => handleRingSelect({ name: ring.name, index: index })}
                  isSelected={selectedRing?.index === index}
                  disabled={isLoading}
                />
              ))}
              {/*{ringCards.rings.map((ring, index) => {*/}
              {/*  const ringName = isValidName(ring.name) ? ring.name : undefined;*/}
              {/*  return (*/}
              {/*    <RingCard*/}
              {/*      key={index}*/}
              {/*      {...ring}*/}
              {/*      name={ringName}*/}
              {/*      handleCardSelect={() => handleRingSelect({ name: ring.name, index: index })}*/}
              {/*      isSelected={selectedRing?.index === index}*/}
              {/*      disabled={isLoading}*/}
              {/*    />*/}
              {/*  );*/}
              {/*})}*/}
            </Stack>
          </StepContent>
        </Step>

        {/*second step*/}
        {/*{selectedRing.index !== -1 && (*/}
        {selectedRing.index !== null && (
          <Step key={steps[1]} completed={isStepTwoComplete}>
            <StepLabel>
              <Typography variant="h6">{steps[1]}</Typography>
            </StepLabel>
            <StepContent>
              <Box
                sx={{
                  display: 'flex',
                  // justifyContent: 'center',
                  // alignItems: 'stretch',
                  flexWrap: 'wrap',
                  justifyContent: 'start',
                  margin: '16px 0',
                  gap: '16px',
                }}
              >
                {ringCards.rings[selectedRing.index]?.confs.map((conf, index) => (
                  <ConformationCard
                    key={index}
                    {...conf}
                    handleCardClick={() => handleConfCardClick(conf.name)}
                    isSelected={filterValues.confs.has(conf.name)}
                    disabled={isLoading}
                    ring={selectedRing.name}
                    favorable={conf.favorable}
                  />
                ))}
              </Box>
            </StepContent>
            {showStickyButton && (
              <StickyButton onClick={handleBrowseData} disabled={isLoading}>
                <Typography variant="h6">Browse the data</Typography>
              </StickyButton>
            )}
          </Step>
        )}
      </Stepper>
    </Box>
  );
}
