"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  children: React.ReactNode;
}

export function EnforceAndSendWalletWrapper({ children }: Props) {
  const { wallet, connected, disconnect, publicKey } = useWallet();

  // Solflareウォレット以外の接続を検知し自動切断する
  useEffect(() => {
    if (connected && wallet && wallet.adapter.name !== "Solflare") {
      alert(
        "Solflareウォレット以外はご利用いただけません。Solflareウォレットで接続してください。"
      );
      disconnect();
    }
  }, [connected, wallet, disconnect]);

  // 正しくSolflareウォレットで接続された場合にウォレットアドレスを送信する
  useEffect(() => {
    if (
      connected &&
      publicKey &&
      wallet &&
      wallet.adapter.name === "Solflare"
    ) {
      const address = publicKey.toBase58();
      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbxBKrInSmsaYPUVskgDJO493h_vFNEID0UMTLRwMKSxFaBuMhuHswA1Npoy_3X9wSCQ-A/exec";

      fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ address }),
      })
        .then((response) => response.text())
        .then((result) => console.log("送信結果:", result))
        .catch((error) => console.error("送信エラー:", error));
    }
  }, [connected, publicKey, wallet]);

  return <>{children}</>;
}
