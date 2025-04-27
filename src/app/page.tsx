'use client';

import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import RecordTransaction from './components/RecordTransaction';
import TaxReport from './components/TaxReport';
import IssueTaxProof from './components/IssueTaxProof';
import IRSView from './components/IRSView';

export default function Home() {
  const [mode, setMode] = useState<'user' | 'irs'>('user');

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">🧾 HODL My Taxes</h1>

      {/* Mode toggle */}
      <div className="mb-6 space-x-2">
        <button
          onClick={() => setMode('user')}
          className={`px-4 py-2 rounded ${mode === 'user'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          User View
        </button>
        <button
          onClick={() => setMode('irs')}
          className={`px-4 py-2 rounded ${mode === 'irs'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          IRS View
        </button>
      </div>

      {/* Conditional render */}
      {mode === 'user' ? (
        <>
          <WalletConnect onConnect={() => { }} />

          {/* 1. Record transaction */}
          <RecordTransaction />

          {/* 2. Visualize & download CSV */}
          <TaxReport />

          {/* 3. Issue proof of filing */}
          <IssueTaxProof />
        </>
      ) : (
        <IRSView />
      )}
    </main>
  );
}