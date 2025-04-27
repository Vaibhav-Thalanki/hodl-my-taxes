'use client';

import WalletConnect from './components/WalletConnect';
import RecordTransaction from './components/RecordTransaction';
import TaxReport from './components/TaxReport';
import IssueTaxProof from './components/IssueTaxProof';
import React, { useState } from 'react';

export default function Home() {
  // lift account state here
  const [account, setAccount] = useState<string | null>(null);
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🎮 Game-Tax Assistant</h1>

      {/* pass onConnect so WalletConnect can notify us */}
      <WalletConnect onConnect={setAccount} />
      <RecordTransaction />
      <TaxReport />
      <IssueTaxProof />
    </main>
  );
}
