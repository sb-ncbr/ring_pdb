import { createContext, useContext, useEffect, useState } from 'react';
import MolstarViewerModel from '../models/MolstarViewerModel';

interface MolstarContextType {
  viewer: MolstarViewerModel;
}

const MolstarContext = createContext<MolstarContextType | undefined>(undefined);

interface MolstarProviderProps {
  children: React.ReactNode;
}

export const MolstarProvider: React.FC<MolstarProviderProps> = ({ children }) => {
  const [viewer, setViewer] = useState<MolstarViewerModel | null>(null);

  useEffect(() => {
    const model = new MolstarViewerModel();
    setViewer(model);
    return () => { void model.dispose(); };
  }, []);

  if (!viewer) return null;

  const value = {
    viewer,
  };

  return <MolstarContext.Provider value={value}>{children}</MolstarContext.Provider>;
};

export const useMolstar = () => {
  const context = useContext(MolstarContext);
  if (context === undefined) {
    throw new Error('useMolstar must be used within a MolstarProvider');
  }
  return context;
};
