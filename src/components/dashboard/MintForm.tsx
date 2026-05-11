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
import { buildMintTransaction } from '@/lib/solana/mint-operations';
import { config } from '@/lib/config';

export function MintForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { mintAddress } = useToken();
  const { isMintAuthority } = useAdminAuth();
  const logAction = useLogAction();
  const { data: pauseState } = usePauseState();

  const isPaused = pauseState?.globalPause || pauseState?.mintPause;

  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastSig, setLastSig] = useState('');

  const validateInputs = (): string | null => {
    if (!amount || parseFloat(amount) <= 0) return 'Enter a valid amount';
    if (!destination) return 'Enter a destination address';
    try {
      new PublicKey(destination);
    } catch {
      return 'Invalid Solana address';
    }
    return null;
  };

  const handleSubmit = () => {
    const error = validateInputs();
    if (error) { toast.error(error); return; }
    setShowConfirm(true);
  };

  const handleMint = async () => {
    if (!publicKey || !mintAddress) return;
    setLoading(true);

    try {
      const mint = new PublicKey(mintAddress);
      const dest = new PublicKey(destination);
      const rawAmount = BigInt(Math.round(parseFloat(amount) * 10 ** config.decimals));

      const tx = await buildMintTransaction(connection, publicKey, mint, dest, rawAmount);
      const sig = await sendTransaction(tx, connection);

      toast.loading('Confirming transaction...', { id: 'mint-confirm' });
      await connection.confirmTransaction(sig, 'confirmed');
      toast.dismiss('mint-confirm');

      logAction.mutate({
        action: 'MINT',
        signature: sig,
        details: { destination, amount: parseFloat(amount) },
        walletAddress: publicKey.toBase58(),
      });

      setLastSig(sig);
      setAmount('');
      setDestination('');
      toast.success(`Minted ${amount} tokens successfully`);
    } catch (e: any) {
      toast.error(e.message || 'Mint failed');
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
            <p className="text-xs text-amber-600">Connected wallet is not the mint authority for this token.</p>
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
            <p className="text-sm font-medium text-red-800">Mint Operations Paused</p>
            <p className="text-xs text-red-600">Minting is currently paused by an administrator.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mint New Tokens</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Create new tokens and send them to any Solana wallet</p>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Destination Wallet Address"
            placeholder="Enter Solana wallet address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {amount && parseFloat(amount) > 0 && (
            <p className="text-xs text-gray-400">
              Raw amount: {BigInt(Math.round(parseFloat(amount) * 10 ** config.decimals)).toString()} (with {config.decimals} decimals)
            </p>
          )}
          <Button onClick={handleSubmit} disabled={!destination || !amount || !publicKey} size="lg">
            Mint Tokens
          </Button>
          {lastSig && (
            <div className="rounded-lg bg-green-50 p-3 border border-green-200">
              <p className="text-xs font-medium text-green-800">Last mint successful</p>
              <a
                href={`https://explorer.solana.com/tx/${lastSig}?cluster=${config.network}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-green-600 hover:underline font-mono break-all"
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
        onConfirm={handleMint}
        title="Confirm Mint"
        description={`You are about to mint ${amount} tokens to ${destination?.slice(0, 8)}...${destination?.slice(-4)}. This will increase the total supply.`}
        confirmLabel="Mint Tokens"
        loading={loading}
      />
    </>
  );
}
