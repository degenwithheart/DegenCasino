import React, { createContext, useContext } from 'react';

export interface GamesModalContextType {
  openGamesModal: () => void;
}

export const GamesModalContext = createContext<GamesModalContextType>({ 
  openGamesModal: () => {} 
});

export const useGamesModal = () => useContext(GamesModalContext);