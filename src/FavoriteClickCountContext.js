import React, { useContext, useMemo } from 'react';
import { GlobalContext } from './GlobalState';

export const FavoriteClickCountContext = React.createContext();

export const FavoriteClickCountProvider = ({ children }) => {
  const { incrementFavoriteClickCount } = useContext(GlobalContext);

  // const provider = { incrementFavoriteClickCont };
  const provider = useMemo(() => {
    return { incrementFavoriteClickCount };
  }, []);

  return (
    <FavoriteClickCountContext.Provider value={provider}>
      {children}
    </FavoriteClickCountContext.Provider>
  );
};
