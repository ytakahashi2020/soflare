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
import { EnforceAndSendWalletWrapper } from "../useEnforceAndSendWallet";

// 独自実装の接続ボタン（必要に応じて利用）
import { SolflareConnectButton } from "../SolflareConnectButton";
// 接続後の自動切断用フック
import { useEnforceSolflare } from "../useEnforceSolflare";
// ウォレットアドレス送信用フック
import { useSendWalletAddress } from "../useSendWalletAddress";

require("@solana/wallet-adapter-react-ui/styles.css");

// 公式のWalletMultiButton（必要であれば利用）
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
          <EnforceAndSendWalletWrapper>{children}</EnforceAndSendWalletWrapper>
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

// useSendWalletAddressフックをラップするコンポーネント
function SendWalletAddressWrapper() {
  useSendWalletAddress();
  return null;
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();
  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}
