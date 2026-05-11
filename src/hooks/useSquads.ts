'use client';

import { useState } from 'react';
import { isSquadsVault } from '@/lib/solana/squads';
import { PublicKey } from '@solana/web3.js';

export function useSquads(authority: PublicKey | null) {
  const [isMultisig] = useState(() => {
    if (!authority) return false;
    return isSquadsVault(authority);
  });

  return { isMultisig };
}
