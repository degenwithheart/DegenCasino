import React, { createContext, useState } from 'react';

interface GambaResultContextType {
  gambaResult: any;
  setGambaResult: (result: any) => void;
}

export const GambaResultContext = createContext<GambaResultContextType>({
  gambaResult: null,
  setGambaResult: () => {},
});

export const GambaResultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gambaResult, setGambaResult] = useState<any>(null);
  return (
    <GambaResultContext.Provider value={{ gambaResult, setGambaResult }}>
      {children}
    </GambaResultContext.Provider>
  );
};
