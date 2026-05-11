'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToken } from '@/contexts/TokenContext';
import { buildCreateTokenTransaction } from '@/lib/solana/token-creation';

const steps = ['Connect Wallet', 'Token Details', 'Deploy'];

export default function CreatePage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { setMintAddress } = useToken();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [uri, setUri] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [banner, setBanner] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [discord, setDiscord] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(connected ? 1 : 0);
  const [deployedMint, setDeployedMint] = useState('');

  const currentStep = !connected ? 0 : deployedMint ? 2 : 1;

  const handleCreate = async () => {
    if (!publicKey) return;
    if (!name.trim()) { toast.error('Token name is required'); return; }
    if (!symbol.trim()) { toast.error('Symbol is required'); return; }
    if (symbol.length > 10) { toast.error('Symbol must be 10 characters or less'); return; }

    setLoading(true);

    try {
      const { transaction, mintKeypair } = await buildCreateTokenTransaction(connection, publicKey, {
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        uri: uri.trim(),
        decimals: 6,
      });

      toast.loading('Deploying token...', { id: 'deploy' });
      const sig = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });

      toast.loading('Confirming on-chain...', { id: 'deploy' });
      await connection.confirmTransaction(sig, 'confirmed');
      toast.dismiss('deploy');

      const mintAddr = mintKeypair.publicKey.toBase58();
      setMintAddress(mintAddr);
      setDeployedMint(mintAddr);

      await fetch('/api/token/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mintAddress: mintAddr,
          action: 'CREATE',
          signature: sig,
          details: { name, symbol: symbol.toUpperCase(), uri, description, image, banner, decimals: 6, socials: { website, twitter, telegram, discord } },
          walletAddress: publicKey.toBase58(),
        }),
      });

      toast.success('Stablecoin deployed successfully!');
    } catch (e: any) {
      toast.dismiss('deploy');
      toast.error(e.message || 'Deployment failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="mx-auto max-w-lg px-4 pt-16 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Stablecoin</h1>
          <p className="mt-2 text-gray-500">Deploy a Token-2022 stablecoin on Solana in seconds</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${i <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`h-px w-8 ${i < currentStep ? 'bg-indigo-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Connect */}
        {!connected && (
          <Card className="text-center animate-fade-in">
            <div className="py-6">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
              <p className="text-gray-600 mb-6">Connect your Solana wallet to get started</p>
              <WalletMultiButton />
              <p className="mt-4 text-xs text-gray-400">Your wallet will be the mint and freeze authority</p>
            </div>
          </Card>
        )}

        {/* Step 1: Token details */}
        {connected && !deployedMint && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Token Configuration</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Token Name"
                placeholder="e.g. USD Coin"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Symbol"
                placeholder="e.g. USDC"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                maxLength={10}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Describe your stablecoin..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Input
                label="Coin Image URL (optional)"
                placeholder="https://example.com/logo.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Input
                label="Banner Image URL (optional)"
                placeholder="https://example.com/banner.png"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
              />

              {/* Image previews */}
              {(image || banner) && (
                <div className="flex gap-4">
                  {image && (
                    <div className="flex-shrink-0">
                      <p className="text-xs text-gray-400 mb-1">Coin Image</p>
                      <img src={image} alt="Coin" className="h-16 w-16 rounded-full object-cover border border-gray-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                  {banner && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Banner</p>
                      <img src={banner} alt="Banner" className="h-16 w-full rounded-lg object-cover border border-gray-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              )}

              <Input
                label="Metadata URI (optional)"
                placeholder="https://example.com/metadata.json"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
              />

              {/* Social Links */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Social Links (optional)</p>
                <Input
                  label="Website"
                  placeholder="https://yourproject.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <Input
                  label="Twitter / X"
                  placeholder="https://x.com/yourproject"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
                <Input
                  label="Telegram"
                  placeholder="https://t.me/yourproject"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
                <Input
                  label="Discord"
                  placeholder="https://discord.gg/yourserver"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                />
              </div>

              {/* Config summary */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Configuration</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Program</span>
                  <span className="text-gray-900 font-medium">Token-2022</span>
                  <span className="text-gray-500">Decimals</span>
                  <span className="text-gray-900 font-medium">6</span>
                  <span className="text-gray-500">Extensions</span>
                  <span className="text-gray-900 font-medium">MetadataPointer</span>
                  <span className="text-gray-500">Mint Authority</span>
                  <span className="text-gray-900 font-mono text-xs">{publicKey?.toBase58().slice(0, 12)}...</span>
                  <span className="text-gray-500">Freeze Authority</span>
                  <span className="text-gray-900 font-mono text-xs">{publicKey?.toBase58().slice(0, 12)}...</span>
                </div>
              </div>

              <Button
                onClick={handleCreate}
                loading={loading}
                disabled={!name || !symbol}
                className="w-full"
                size="lg"
              >
                Deploy Stablecoin
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Success */}
        {deployedMint && (
          <Card className="animate-fade-in">
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Stablecoin Deployed!</h3>
              <p className="mt-1 text-sm text-gray-500">{name} ({symbol}) is live on Solana</p>

              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Mint Address</p>
                <p className="font-mono text-xs text-gray-700 break-all">{deployedMint}</p>
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <Button onClick={() => router.push('/dashboard')} size="lg">
                  Go to Dashboard
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(deployedMint);
                    toast.success('Copied mint address');
                  }}
                >
                  Copy Address
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Existing mint shortcut */}
        {!deployedMint && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Already have a token?{' '}
              <a href="/dashboard/settings" className="text-indigo-600 hover:underline">Enter mint address</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
