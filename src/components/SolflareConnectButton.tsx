"use client";

import React, { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";

export function SolflareConnectButton() {
  const { wallets, select, connected, wallet } = useWallet();

  // wallets 配列からSolflareのみを抽出
  const solflareWallet = wallets.find((w) => w.adapter.name === "Solflare");

  const handleConnect = useCallback(() => {
    if (solflareWallet) {
      select(solflareWallet.adapter.name as WalletName);
    }
  }, [select, solflareWallet]);

  return (
    <button onClick={handleConnect}>
      {connected && wallet?.adapter.name === "Solflare"
        ? "Solflare接続済み"
        : "Solflareに接続"}
    </button>
  );
}
