'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToken } from '@/contexts/TokenContext';
import { useLogAction } from '@/hooks/useTransactionLog';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { buildUpdateMetadataTransaction } from '@/lib/solana/metadata-operations';
import { config } from '@/lib/config';

export default function SettingsPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { mintAddress, setMintAddress } = useToken();
  const { isMintAuthority } = useAdminAuth();
  const logAction = useLogAction();

  const [field, setField] = useState('name');
  const [value, setValue] = useState('');
  const [newMint, setNewMint] = useState(mintAddress);
  const [loading, setLoading] = useState(false);

  const handleUpdateMint = () => {
    if (!newMint.trim()) { toast.error('Enter a mint address'); return; }
    try {
      new PublicKey(newMint.trim());
      setMintAddress(newMint.trim());
      toast.success('Mint address updated');
    } catch {
      toast.error('Invalid Solana address');
    }
  };

  const handleUpdateMetadata = async () => {
    if (!publicKey || !mintAddress || !value.trim()) {
      toast.error('Fill in all fields');
      return;
    }
    setLoading(true);

    try {
      const mint = new PublicKey(mintAddress);
      const tx = await buildUpdateMetadataTransaction(connection, publicKey, mint, field, value.trim());
      const sig = await sendTransaction(tx, connection);

      toast.loading('Confirming...', { id: 'meta-update' });
      await connection.confirmTransaction(sig, 'confirmed');
      toast.dismiss('meta-update');

      logAction.mutate({
        action: 'UPDATE_METADATA',
        signature: sig,
        details: { field, value: value.trim() },
        walletAddress: publicKey.toBase58(),
      });

      toast.success(`Metadata field "${field}" updated`);
      setValue('');
    } catch (e: any) {
      toast.dismiss('meta-update');
      toast.error(e.message || 'Update failed');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure your stablecoin management dashboard</p>
      </div>

      {/* Mint Address Config */}
      <Card>
        <CardHeader>
          <CardTitle>Mint Address</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Switch to a different token by entering its mint address</p>
        </CardHeader>
        <div className="space-y-3">
          <Input
            value={newMint}
            onChange={(e) => setNewMint(e.target.value)}
            placeholder="Enter Token-2022 mint address"
          />
          <div className="flex gap-2">
            <Button onClick={handleUpdateMint} variant="secondary">
              Update
            </Button>
            {mintAddress && (
              <Button
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(mintAddress);
                  toast.success('Copied');
                }}
              >
                Copy Current
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Network Info */}
      <Card>
        <CardHeader>
          <CardTitle>Network Configuration</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-400 mb-1">Network</p>
              <p className="font-medium text-gray-900 capitalize">{config.network}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-400 mb-1">RPC Endpoint</p>
              <p className="font-mono text-xs text-gray-700 truncate">{config.rpcUrl}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            To change network or RPC, update <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SOLANA_RPC_URL</code> and <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SOLANA_NETWORK</code> in your .env file and restart the server.
          </p>
        </div>
      </Card>

      {/* Metadata Updates */}
      {isMintAuthority && (
        <Card>
          <CardHeader>
            <CardTitle>Update Token Metadata</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Modify on-chain metadata fields (requires update authority)</p>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
              <select
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={field}
                onChange={(e) => setField(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="symbol">Symbol</option>
                <option value="uri">URI</option>
              </select>
            </div>
            <Input
              label="New Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter new ${field}`}
            />
            <Button onClick={handleUpdateMetadata} loading={loading} disabled={!value.trim()}>
              Update Metadata
            </Button>
          </div>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>
            <span className="text-red-700">Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-red-100 p-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Disconnect Token</p>
              <p className="text-xs text-gray-500">Remove the mint address from this dashboard (does not affect on-chain data)</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setMintAddress('');
                toast.success('Disconnected from token');
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
