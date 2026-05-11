'use client';

import { useEffect, useState, useRef } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useToken } from '@/contexts/TokenContext';
import { isWalletAuthority } from '@/lib/auth';

export function useAdminAuth() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { mintAddress } = useToken();
  const [isMintAuthority, setIsMintAuthority] = useState(false);
  const [isFreezeAuthority, setIsFreezeAuthority] = useState(false);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef(false);

  useEffect(() => {
    abortRef.current = false;

    if (!connected || !publicKey || !mintAddress) {
      setIsMintAuthority(false);
      setIsFreezeAuthority(false);
      setLoading(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    async function check() {
      setLoading(true);
      try {
        const mint = new PublicKey(mintAddress);

        // Race the RPC call against a 10s timeout
        const result = await Promise.race([
          isWalletAuthority(connection, mint, publicKey!),
          new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('RPC timeout')), 10000);
          }),
        ]);

        if (!abortRef.current) {
          setIsMintAuthority(result.isMintAuthority);
          setIsFreezeAuthority(result.isFreezeAuthority);
        }
      } catch (err) {
        console.error('[useAdminAuth]', err);
        if (!abortRef.current) {
          setIsMintAuthority(false);
          setIsFreezeAuthority(false);
        }
      }
      if (!abortRef.current) {
        setLoading(false);
      }
    }

    check();

    return () => {
      abortRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [connection, publicKey, connected, mintAddress]);

  return { isMintAuthority, isFreezeAuthority, loading, connected, publicKey };
}
