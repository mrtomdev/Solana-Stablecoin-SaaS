'use client';

import { useState } from 'react';
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
import { buildFreezeTransaction, buildThawTransaction } from '@/lib/solana/freeze-operations';
import { config } from '@/lib/config';

export function FreezeForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { mintAddress } = useToken();
  const { isFreezeAuthority } = useAdminAuth();
  const logAction = useLogAction();
  const { data: pauseState } = usePauseState();

  const isPaused = pauseState?.globalPause || pauseState?.freezePause;

  const [targetAddress, setTargetAddress] = useState('');
  const [action, setAction] = useState<'FREEZE' | 'THAW'>('FREEZE');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastSig, setLastSig] = useState('');

  const validateTarget = (): boolean => {
    try {
      new PublicKey(targetAddress);
      return true;
    } catch {
      toast.error('Invalid Solana address');
      return false;
    }
  };

  const handleAction = async () => {
    if (!publicKey || !mintAddress) return;
    setLoading(true);

    try {
      const mint = new PublicKey(mintAddress);
      const target = new PublicKey(targetAddress);

      const tx = action === 'FREEZE'
        ? await buildFreezeTransaction(connection, publicKey, mint, target)
        : await buildThawTransaction(connection, publicKey, mint, target);

      const sig = await sendTransaction(tx, connection);

      toast.loading(`Confirming ${action.toLowerCase()}...`, { id: 'freeze-confirm' });
      await connection.confirmTransaction(sig, 'confirmed');
      toast.dismiss('freeze-confirm');

      logAction.mutate({
        action,
        signature: sig,
        details: { targetAddress },
        walletAddress: publicKey.toBase58(),
      });

      setLastSig(sig);
      setTargetAddress('');
      toast.success(`Account ${action === 'FREEZE' ? 'frozen' : 'thawed'} successfully`);
    } catch (e: any) {
      toast.error(e.message || `${action} failed`);
    }

    setLoading(false);
    setShowConfirm(false);
  };

  if (!isFreezeAuthority) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Not Authorized</p>
            <p className="text-xs text-amber-600">Connected wallet is not the freeze authority for this token.</p>
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
            <p className="text-sm font-medium text-red-800">Freeze Operations Paused</p>
            <p className="text-xs text-red-600">Freeze/Thaw operations are currently paused by an administrator.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Freeze / Thaw Token Accounts</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Freeze prevents a wallet from transferring tokens. Thaw restores normal functionality.
          </p>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Target Wallet Address"
            placeholder="Enter the wallet address to freeze or thaw"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
          />

          {/* Action tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setAction('FREEZE')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                action === 'FREEZE'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Freeze Account
            </button>
            <button
              onClick={() => setAction('THAW')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                action === 'THAW'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Thaw Account
            </button>
          </div>

          <Button
            variant={action === 'FREEZE' ? 'danger' : 'primary'}
            onClick={() => validateTarget() && setShowConfirm(true)}
            disabled={!targetAddress || !publicKey}
            size="lg"
            className="w-full"
          >
            {action === 'FREEZE' ? 'Freeze Account' : 'Thaw Account'}
          </Button>

          {lastSig && (
            <div className="rounded-lg bg-gray-50 p-3 border">
              <p className="text-xs font-medium text-gray-800">Last action confirmed</p>
              <a
                href={`https://explorer.solana.com/tx/${lastSig}?cluster=${config.network}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline font-mono break-all"
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
        onConfirm={handleAction}
        title={`Confirm ${action === 'FREEZE' ? 'Freeze' : 'Thaw'}`}
        description={
          action === 'FREEZE'
            ? `Freezing will prevent ${targetAddress?.slice(0, 8)}... from transferring this token until you thaw the account.`
            : `Thawing will restore ${targetAddress?.slice(0, 8)}...'s ability to transfer this token.`
        }
        confirmLabel={action === 'FREEZE' ? 'Freeze Account' : 'Thaw Account'}
        loading={loading}
        variant={action === 'FREEZE' ? 'danger' : 'primary'}
      />
    </>
  );
}
