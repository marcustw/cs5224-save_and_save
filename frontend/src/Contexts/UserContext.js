import React from 'react';

export const UserContext = React.createContext(null);

export const UserContextProvider = ({ user, signOut, children }) => {
  const value = React.useMemo(() => {
    return {
      user,
      signOut
    };
  }, [user, signOut]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
