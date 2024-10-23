import * as React from 'react';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const steps = ['Select a ring type', 'Select a conformation'];

const StickyButton = styled(Button)(({ theme }) => ({
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, background-color 0.5s ease',
  animation: 'colorChange 2s forwards',
  backgroundColor: 'transparent',
  position: 'sticky',
  top: '20px',
  '@keyframes colorChange': {
    '0%': {
      backgroundColor: 'transparent',
    },
    '100%': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const AnimatedCard = styled(Card)`
  padding: 16px;
  color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //box-shadow: 3;
  transition:
    transform 0.3s ease-in-out,
    background-color 0.5s ease;
  animation: colorChange 2s forwards;

  @keyframes colorChange {
    0% {
      background-color: transparent;
    }
    100% {
      background-color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  &:hover {
    //transform: scale(1.05); // Scale on hover
    //box-shadow: 6;
  }
`;

export default function RingsStepper() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [filterValues, setFilterValues] = useState({ ring: null, conf: null });
  const [selectedRing, setSelectedRing] = useState({ name: null, index: null });
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [isStepTwoComplete, setIsStepTwoComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRingSelect = (ring) => {
    setSelectedRing(ring);
    setFilterValues({ ring: ring.name, conf: null });
    setIsStepTwoComplete(false);
    setShowStickyButton(false);
    if (!selectedRing.index) {
      handleNext();
    }
  };
  const handleConfSelect = (conf) => {
    setFilterValues({ ...filterValues, conf: conf });
    setIsStepTwoComplete(true);
    setShowStickyButton(true);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1));
  };

  const handleBrowseData = () => {
    setIsLoading(true);
    navigate(`/data?ring=${filterValues.ring}&conf=${filterValues.conf}`);
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
            </Stack>
          </StepContent>
        </Step>

        {/*second step*/}
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
                    handleCardSelect={() => handleConfSelect(conf.name)}
                    isSelected={filterValues.conf === conf.name}
                    disabled={isLoading}
                    ring={selectedRing.name}
                    favorable={conf.favorable}
                  />
                ))}
                {/* Button Card */}
                {showStickyButton && (
                  <AnimatedCard sx={{ width: '292px' }}>
                    <CardActionArea
                      sx={{
                        height: '100%',
                      }}
                      onClick={handleBrowseData}
                      disabled={isLoading}
                    >
                      <CardContent>
                        <Typography variant="h6">Browse the data</Typography>
                      </CardContent>
                    </CardActionArea>
                  </AnimatedCard>
                )}
              </Box>
            </StepContent>
            {/*Change this*/}
            {/*{showStickyButton && (*/}
            {/*  <StickyButton>*/}
            {/*    <Typography variant="h6">Browse the data</Typography>*/}
            {/*  </StickyButton>*/}
            {/*)}*/}
          </Step>
        )}
      </Stepper>
    </Box>
  );
}
