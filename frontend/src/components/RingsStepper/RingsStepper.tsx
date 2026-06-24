import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import { RingCard } from '../RingCard.tsx';
import stats from '../../content/stats.json';
import { ConformationCard } from '../ConformationCard.tsx';
import { StepContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { RingType } from '../../data/dataTypes.ts';

const steps = ['Select a ring type (single choice)', 'Select conformations (multiple choice)'];

const StickyButton = styled(Button)(({ theme }) => ({
  zIndex: 1,
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
  const [filterValues, setFilterValues] = useState<{
    ring: string | null;
    confs: Set<string>;
  }>({ ring: null, confs: new Set() });
  const [selectedRing, setSelectedRing] = useState<{ name: string | null; index: number | null }>({
    name: null,
    index: null,
  });
  const [selectedConfs, setSelectedConfs] = useState<
    Set<{
      name: string;
      count: number;
      favorable: boolean;
    }>
  >(new Set());
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [isStepTwoComplete, setIsStepTwoComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRingSelect = (ring: { name: string; index: number }) => {
    setSelectedRing(ring);
    setSelectedConfs(new Set());
    setFilterValues({ ring: ring.name, confs: new Set() });
    setIsStepTwoComplete(false);
    setShowStickyButton(false);
    if (!selectedRing.index) {
      handleNext();
    }
  };

  const handleConfCardClick = (conf: { name: string; count: number; favorable: boolean }) => {
    setFilterValues((prevFilterValues) => {
      const confs = selectedConfs;
      if (confs.has(conf)) {
        confs.delete(conf);
        prevFilterValues.confs.delete(conf.name);
      } else {
        confs.add(conf);
        prevFilterValues.confs.add(conf.name);
        // refactor this later
        setSelectedConfs((prevSelectedConfs) => {
          const newSet = new Set(prevSelectedConfs);
          newSet.add(conf);
          return newSet;
        });
      }
      return {
        ...prevFilterValues,
      };
    });
    setIsStepTwoComplete(filterValues.confs.size != 0);
    setShowStickyButton(filterValues.confs.size != 0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1));
  };

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

  const ringName = selectedRing.name as RingType;
  const ringIndex = selectedRing.index;

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
            <Typography variant="subtitle1">{steps[0]}</Typography>
          </StepLabel>
          <StepContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'start',
                my: 2,
                gap: 3,
              }}
            >
              {stats.rings.map((ring: any, index: number) => (
                <RingCard
                  key={index}
                  {...ring}
                  handleCardSelect={() =>
                    handleRingSelect({
                      name: ring.name,
                      index,
                    })
                  }
                  isSelected={selectedRing?.index === index}
                  disabled={isLoading}
                />
              ))}
            </Box>
          </StepContent>
        </Step>

        {/*second step*/}
        {ringIndex !== null && ringName !== null && (
          <Step key={steps[1]} completed={isStepTwoComplete}>
            <StepLabel>
              <Typography variant="subtitle1">{steps[1]}</Typography>
            </StepLabel>
            <StepContent>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'start',
                  my: 2,
                  gap: 3,
                }}
              >
                {stats.rings[ringIndex].confs.map((conf, index) => (
                  <ConformationCard
                    key={index}
                    {...conf}
                    handleCardClick={() => handleConfCardClick(conf)}
                    isSelected={selectedConfs.has(conf)}
                    disabled={isLoading}
                    ring={ringName}
                  />
                ))}
              </Box>
            </StepContent>
            {showStickyButton && (
              <StickyButton onClick={handleBrowseData} disabled={isLoading}>
                <Typography variant="subtitle1">Browse the data</Typography>
              </StickyButton>
            )}
          </Step>
        )}
      </Stepper>
    </Box>
  );
}
