'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToken } from '@/contexts/TokenContext';

export function usePauseState() {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['pauseState', mintAddress],
    queryFn: async () => {
      const res = await fetch(`/api/pause/state?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch pause state');
      return res.json();
    },
    enabled: !!mintAddress,
    refetchInterval: 15000,
  });
}

export function useUpdatePauseState() {
  const qc = useQueryClient();
  const { mintAddress } = useToken();
  return useMutation({
    mutationFn: async (data: {
      globalPause?: boolean;
      mintPause?: boolean;
      burnPause?: boolean;
      transferPause?: boolean;
      freezePause?: boolean;
      walletAddress: string;
      scope: string;
      action: string;
      reason?: string;
    }) => {
      const res = await fetch('/api/pause/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAddress, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update pause state');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pauseState', mintAddress] });
      qc.invalidateQueries({ queryKey: ['pauseHistory', mintAddress] });
    },
  });
}

export function useCircuitBreaker() {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['circuitBreaker', mintAddress],
    queryFn: async () => {
      const res = await fetch(`/api/pause/circuit-breaker?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch circuit breaker config');
      return res.json();
    },
    enabled: !!mintAddress,
  });
}

export function useUpdateCircuitBreaker() {
  const qc = useQueryClient();
  const { mintAddress } = useToken();
  return useMutation({
    mutationFn: async (data: { supplyChangeThreshold: number; timeWindowMinutes: number; autoPauseEnabled: boolean }) => {
      const res = await fetch('/api/pause/circuit-breaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAddress, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update circuit breaker');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['circuitBreaker', mintAddress] }),
  });
}

export function usePauseHistory() {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['pauseHistory', mintAddress],
    queryFn: async () => {
      const res = await fetch(`/api/pause/history?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch pause history');
      return res.json();
    },
    enabled: !!mintAddress,
  });
}
