import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface YoutubeSyncButtonProps {
  onSync: () => Promise<void>;
  disabled?: boolean;
  lastSyncDate?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  errorMessage?: string | null;
}

export function YoutubeSyncButton({
  onSync,
  disabled = false,
  lastSyncDate,
  size = 'md',
  label = 'Synchroniser YouTube',
  errorMessage,
}: YoutubeSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    setLocalError(null);

    try {
      await onSync();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Erreur de synchronisation';
      setLocalError(errorMsg);
      setTimeout(() => {
        setSyncStatus('idle');
        setLocalError(null);
      }, 10000);
    } finally {
      setIsSyncing(false);
    }
  };

  const getIcon = () => {
    if (syncStatus === 'success') return CheckCircle2;
    if (syncStatus === 'error') return AlertCircle;
    return RefreshCw;
  };

  const Icon = getIcon();

  const getButtonText = () => {
    if (isSyncing) return 'Synchronisation...';
    if (syncStatus === 'success') return 'Synchronisé !';
    if (syncStatus === 'error') return 'Erreur';
    return label;
  };

  const getButtonVariant = () => {
    if (syncStatus === 'success') return 'success';
    if (syncStatus === 'error') return 'danger';
    return 'secondary';
  };

  const displayError = errorMessage || localError;

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleSync}
        disabled={disabled || isSyncing}
        variant={getButtonVariant()}
        size={size}
      >
        <Icon
          className={isSyncing ? 'animate-spin' : ''}
          size={size === 'sm' ? 14 : 16}
        />
        {getButtonText()}
      </Button>
      {displayError && syncStatus === 'error' && (
        <span className="text-xs text-red-500 max-w-xs">
          {displayError}
        </span>
      )}
      {lastSyncDate && syncStatus === 'idle' && !displayError && (
        <span className="text-xs text-muted">
          Dernière sync: {new Date(lastSyncDate).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )}
    </div>
  );
}
