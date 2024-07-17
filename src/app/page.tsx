"use client";
import Header from "@/components/Header";
import { NotificationProvider } from "@web3uikit/web3";
import LotteryEntrance from "@/components/LotteryEntrance";
import { MoralisProvider } from "react-moralis";

export default function Home() {
  return (
    <MoralisProvider initializeOnMount={false}>
      {/* <NotificationProvider> */}
      <main className="min-h-screen">
        <Header />
        <LotteryEntrance />
        <div>WHATS UP</div>
      </main>
      {/* </NotificationProvider> */}
    </MoralisProvider>
  );
}
