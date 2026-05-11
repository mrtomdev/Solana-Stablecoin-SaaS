'use client';

import { createContext, useContext, ReactNode } from 'react';
import { config } from '@/lib/config';

const ConfigContext = createContext(config);

export function ConfigProvider({ children }: { children: ReactNode }) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export const useConfig = () => useContext(ConfigContext);
