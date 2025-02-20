"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

export function useSendWalletAddress() {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    console.log("dddddddd");
    if (connected && publicKey) {
      const address = publicKey.toBase58();
      // Google Apps Script のWebアプリURL（YOUR_SCRIPT_IDを実際のIDに置き換えてください）
      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbxBKrInSmsaYPUVskgDJO493h_vFNEID0UMTLRwMKSxFaBuMhuHswA1Npoy_3X9wSCQ-A/exec";

      // POSTリクエストでアドレスを送信
      fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ address }),
      })
        .then((response) => response.text())
        .then((result) => console.log("送信結果:", result))
        .catch((error) => console.error("送信エラー:", error));
    }
  }, [connected, publicKey]);
}
