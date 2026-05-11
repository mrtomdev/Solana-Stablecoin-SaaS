'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToken } from '@/contexts/TokenContext';

export function useLiquidityConfig() {
  const { mintAddress } = useToken();
  return useQuery({
    queryKey: ['liquidityConfig', mintAddress],
    queryFn: async () => {
      const res = await fetch(`/api/liquidity/config?mint=${mintAddress}`);
      if (!res.ok) throw new Error('Failed to fetch liquidity config');
      return res.json();
    },
    enabled: !!mintAddress,
  });
}

export function useUpdateLiquidityConfig() {
  const qc = useQueryClient();
  const { mintAddress } = useToken();
  return useMutation({
    mutationFn: async (data: { totalLiquidity?: number; reserveTarget?: number; collateralRatio?: number; reserveBalance?: number }) => {
      const res = await fetch('/api/liquidity/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAddress, ...data }),
      });
      if (!res.ok) throw new Error('Failed to update liquidity config');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['liquidityConfig', mintAddress] }),
  });
}
