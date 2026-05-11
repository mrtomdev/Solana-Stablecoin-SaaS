'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TokenContextType {
  mintAddress: string;
  setMintAddress: (addr: string) => void;
}

const TokenContext = createContext<TokenContextType>({
  mintAddress: '',
  setMintAddress: () => {},
});

export function TokenProvider({ children }: { children: ReactNode }) {
  const [mintAddress, setMintAddress] = useState('');

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const stored = localStorage.getItem('mintAddress');
    if (stored) setMintAddress(stored);
  }, []);

  const handleSetMint = (addr: string) => {
    setMintAddress(addr);
    localStorage.setItem('mintAddress', addr);
  };

  return (
    <TokenContext.Provider value={{ mintAddress, setMintAddress: handleSetMint }}>
      {children}
    </TokenContext.Provider>
  );
}

export const useToken = () => useContext(TokenContext);
