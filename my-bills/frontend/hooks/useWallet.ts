import { useState, useEffect, useCallback } from 'react';
import { Wallet, CreateWalletData } from '../../backend/models/types';
import * as walletService from '../../backend/services/walletService';

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.getWallet();
      setWallet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carteira');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWallet = useCallback(async (data: CreateWalletData) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await walletService.updateWallet(data);
      setWallet(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar carteira');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  return {
    wallet,
    loading,
    error,
    updateWallet,
    refreshWallet: loadWallet,
  };
};

