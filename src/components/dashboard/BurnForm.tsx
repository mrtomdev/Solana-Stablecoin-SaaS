'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ActionConfirmDialog } from './ActionConfirmDialog';
import { useToken } from '@/contexts/TokenContext';
import { useLogAction } from '@/hooks/useTransactionLog';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePauseState } from '@/hooks/usePause';
import { buildBurnTransaction } from '@/lib/solana/burn-operations';
import { getTokenBalance } from '@/lib/solana/account-utils';
import { config } from '@/lib/config';

export function BurnForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { mintAddress } = useToken();
  const { isMintAuthority } = useAdminAuth();
  const logAction = useLogAction();
  const { data: pauseState } = usePauseState();

  const isPaused = pauseState?.globalPause || pauseState?.burnPause;

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [lastSig, setLastSig] = useState('');

  useEffect(() => {
    async function fetchBalance() {
      if (!publicKey || !mintAddress) return;
      try {
        const mint = new PublicKey(mintAddress);
        const bal = await getTokenBalance(connection, mint, publicKey);
        setBalance((Number(bal) / 10 ** config.decimals).toString());
      } catch { /* ignore */ }
    }
    fetchBalance();
  }, [connection, publicKey, mintAddress, lastSig]);

  const handleBurn = async () => {
    if (!publicKey || !mintAddress) return;
    setLoading(true);

    try {
      const mint = new PublicKey(mintAddress);
      const rawAmount = BigInt(Math.round(parseFloat(amount) * 10 ** config.decimals));
      const bal = await getTokenBalance(connection, mint, publicKey);

      if (bal < rawAmount) {
        toast.error(`Insufficient balance. You have ${balance} tokens.`);
        setLoading(false);
        setShowConfirm(false);
        return;
      }

      const tx = await buildBurnTransaction(connection, publicKey, mint, rawAmount);
      const sig = await sendTransaction(tx, connection);

      toast.loading('Confirming burn...', { id: 'burn-confirm' });
      await connection.confirmTransaction(sig, 'confirmed');
      toast.dismiss('burn-confirm');

      logAction.mutate({
        action: 'BURN',
        signature: sig,
        details: { amount: parseFloat(amount) },
        walletAddress: publicKey.toBase58(),
      });

      setLastSig(sig);
      setAmount('');
      toast.success(`Burned ${amount} tokens`);
    } catch (e: any) {
      toast.error(e.message || 'Burn failed');
    }

    setLoading(false);
    setShowConfirm(false);
  };

  if (!isMintAuthority) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Not Authorized</p>
            <p className="text-xs text-amber-600">Only the mint authority can burn tokens from their account.</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isPaused) {
    return (
      <Card className="border-red-200 bg-red-50">
        <div className="flex items-center gap-3 p-2">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <p className="text-sm font-medium text-red-800">Burn Operations Paused</p>
            <p className="text-xs text-red-600">Burning is currently paused by an administrator.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Burn Tokens</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Permanently destroy tokens from your wallet to reduce supply</p>
        </CardHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Your Token Balance</span>
            <span className="text-sm font-semibold text-gray-900">{parseFloat(balance).toLocaleString()}</span>
          </div>
          <Input
            label="Amount to Burn"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {amount && parseFloat(amount) > parseFloat(balance) && (
            <p className="text-xs text-red-500">Amount exceeds your balance</p>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAmount((parseFloat(balance) * 0.25).toFixed(6))}>25%</Button>
            <Button variant="ghost" size="sm" onClick={() => setAmount((parseFloat(balance) * 0.5).toFixed(6))}>50%</Button>
            <Button variant="ghost" size="sm" onClick={() => setAmount(balance)}>Max</Button>
          </div>
          <Button
            variant="danger"
            onClick={() => amount && parseFloat(amount) > 0 ? setShowConfirm(true) : toast.error('Enter a valid amount')}
            disabled={!amount || !publicKey}
            size="lg"
          >
            Burn Tokens
          </Button>
          {lastSig && (
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-xs font-medium text-red-800">Burn confirmed</p>
              <a
                href={`https://explorer.solana.com/tx/${lastSig}?cluster=${config.network}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-red-600 hover:underline font-mono break-all"
              >
                {lastSig}
              </a>
            </div>
          )}
        </div>
      </Card>

      <ActionConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleBurn}
        title="Confirm Burn"
        description={`You are about to permanently burn ${amount} tokens. This action cannot be undone and will reduce total supply.`}
        confirmLabel="Burn Tokens"
        loading={loading}
        variant="danger"
      />
    </>
  );
}
