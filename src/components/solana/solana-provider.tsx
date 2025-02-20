"use client";

import dynamic from "next/dynamic";
import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ReactNode, useCallback, useMemo } from "react";
import { useCluster } from "../cluster/cluster-data-access";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

require("@solana/wallet-adapter-react-ui/styles.css");

// ※公式のWalletMultiButtonの代わりに、独自のSolflareConnectButtonを使います
import { SolflareConnectButton } from "../SolflareConnectButton"; // 上記の独自ボタンコンポーネント

// 接続後のウォレット監視フック
import { useEnforceSolflare } from "../useEnforceSolflare";

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const endpoint = useMemo(() => cluster.endpoint, [cluster]);
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  // wallets配列にSolflareのみを指定
  const wallets = useMemo(() => [new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          {/* 接続状態を監視してSolflare以外の場合は自動切断 */}
          <EnforceSolflareWrapper />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// useEnforceSolflareフックをラップするコンポーネント
function EnforceSolflareWrapper() {
  useEnforceSolflare();
  return null;
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}
