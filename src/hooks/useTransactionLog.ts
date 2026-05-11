'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToken } from '@/contexts/TokenContext';
import { AdminActionType } from '@/lib/types';

export function useTransactionLog() {
  const { mintAddress } = useToken();

  return useQuery({
    queryKey: ['transactions', mintAddress],
    queryFn: async () => {
      if (!mintAddress) return [];
      const res = await fetch(`/api/token/transactions?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    },
    enabled: !!mintAddress,
  });
}

export function useLogAction() {
  const queryClient = useQueryClient();
  const { mintAddress } = useToken();

  return useMutation({
    mutationFn: async (params: {
      action: AdminActionType;
      signature?: string;
      details?: Record<string, unknown>;
      walletAddress: string;
      status?: string;
    }) => {
      const res = await fetch('/api/token/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAddress, ...params }),
      });
      if (!res.ok) throw new Error('Failed to log action');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', mintAddress] });
    },
  });
}
