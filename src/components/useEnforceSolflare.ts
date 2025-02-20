"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export function useEnforceSolflare() {
  const { wallet, connected, disconnect } = useWallet();

  useEffect(() => {
    if (connected && wallet && wallet.adapter.name !== "Solflare") {
      alert(
        "Solflareウォレット以外はご利用いただけません。Solflareウォレットで接続してください。"
      );
      disconnect();
    }
  }, [connected, wallet, disconnect]);
}
