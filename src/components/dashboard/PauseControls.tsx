'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePauseState, useUpdatePauseState } from '@/hooks/usePause';
import { useWallet } from '@solana/wallet-adapter-react';
import { ActionConfirmDialog } from './ActionConfirmDialog';
import toast from 'react-hot-toast';

interface ToggleItem {
  key: 'mintPause' | 'burnPause' | 'transferPause' | 'freezePause';
  label: string;
  scope: string;
  description: string;
}

const TOGGLES: ToggleItem[] = [
  { key: 'mintPause', label: 'Mint Operations', scope: 'MINT', description: 'Pause all minting of new tokens' },
  { key: 'burnPause', label: 'Burn Operations', scope: 'BURN', description: 'Pause all token burning' },
  { key: 'transferPause', label: 'Transfer Operations', scope: 'TRANSFER', description: 'Pause all token transfers' },
  { key: 'freezePause', label: 'Freeze Operations', scope: 'FREEZE', description: 'Pause freeze/thaw actions' },
];

export function PauseControls() {
  const { data: state, isLoading } = usePauseState();
  const updateState = useUpdatePauseState();
  const { publicKey } = useWallet();
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void; variant: 'primary' | 'danger' }>({ open: false, title: '', description: '', onConfirm: () => {}, variant: 'primary' });

  const globalPaused = state?.globalPause ?? false;
  const walletAddress = publicKey?.toBase58() ?? '';

  const handleEmergencyPause = () => {
    setConfirmDialog({
      open: true,
      title: 'Emergency Pause All Operations',
      description: 'This will immediately pause ALL operations (mint, burn, transfer, freeze). Are you sure?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await updateState.mutateAsync({
            globalPause: true,
            walletAddress,
            scope: 'GLOBAL',
            action: 'PAUSE',
            reason: 'Emergency pause activated',
          });
          toast.success('All operations paused');
        } catch {
          toast.error('Failed to pause operations');
        }
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleUnpauseAll = () => {
    setConfirmDialog({
      open: true,
      title: 'Resume All Operations',
      description: 'This will resume all paused operations. Are you sure?',
      variant: 'primary',
      onConfirm: async () => {
        try {
          await updateState.mutateAsync({
            globalPause: false,
            mintPause: false,
            burnPause: false,
            transferPause: false,
            freezePause: false,
            walletAddress,
            scope: 'GLOBAL',
            action: 'UNPAUSE',
            reason: 'All operations resumed',
          });
          toast.success('All operations resumed');
        } catch {
          toast.error('Failed to resume operations');
        }
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleToggle = (toggle: ToggleItem) => {
    const currentValue = state?.[toggle.key] ?? false;
    const newAction = currentValue ? 'UNPAUSE' : 'PAUSE';
    setConfirmDialog({
      open: true,
      title: `${newAction === 'PAUSE' ? 'Pause' : 'Resume'} ${toggle.label}`,
      description: `Are you sure you want to ${newAction.toLowerCase()} ${toggle.label.toLowerCase()}?`,
      variant: newAction === 'PAUSE' ? 'danger' : 'primary',
      onConfirm: async () => {
        try {
          await updateState.mutateAsync({
            [toggle.key]: !currentValue,
            walletAddress,
            scope: toggle.scope,
            action: newAction,
          });
          toast.success(`${toggle.label} ${newAction === 'PAUSE' ? 'paused' : 'resumed'}`);
        } catch {
          toast.error(`Failed to update ${toggle.label.toLowerCase()}`);
        }
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  if (isLoading) {
    return <Card><div className="h-48 animate-pulse rounded bg-gray-100" /></Card>;
  }

  return (
    <div className="space-y-6">
      {/* Global Pause Banner */}
      {globalPaused && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Global Pause Active</p>
              <p className="text-xs text-red-600">All operations are currently paused</p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Controls */}
      <Card>
        <CardHeader><CardTitle>Emergency Controls</CardTitle></CardHeader>
        <div className="flex gap-3">
          {!globalPaused ? (
            <Button variant="danger" size="lg" onClick={handleEmergencyPause} className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              EMERGENCY PAUSE ALL
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={handleUnpauseAll} className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              RESUME ALL OPERATIONS
            </Button>
          )}
        </div>
      </Card>

      {/* Individual Toggles */}
      <Card>
        <CardHeader><CardTitle>Individual Operation Controls</CardTitle></CardHeader>
        <div className="space-y-3">
          {TOGGLES.map((toggle) => {
            const isPaused = state?.[toggle.key] ?? false;
            return (
              <div key={toggle.key} className={`flex items-center justify-between rounded-lg border p-4 ${isPaused ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                <div>
                  <p className="text-sm font-medium text-gray-900">{toggle.label}</p>
                  <p className="text-xs text-gray-500">{toggle.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${isPaused ? 'text-red-600' : 'text-green-600'}`}>{isPaused ? 'PAUSED' : 'ACTIVE'}</span>
                  <button
                    type="button"
                    onClick={() => handleToggle(toggle)}
                    disabled={globalPaused}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${!isPaused ? 'bg-green-500' : 'bg-red-400'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${!isPaused ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <ActionConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        loading={updateState.isPending}
      />
    </div>
  );
}
