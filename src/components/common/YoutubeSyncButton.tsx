import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface YoutubeSyncButtonProps {
  onSync: () => Promise<void>;
  disabled?: boolean;
  lastSyncDate?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function YoutubeSyncButton({
  onSync,
  disabled = false,
  lastSyncDate,
  size = 'md',
  label = 'Synchroniser YouTube',
}: YoutubeSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      await onSync();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
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
      {lastSyncDate && syncStatus === 'idle' && (
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
