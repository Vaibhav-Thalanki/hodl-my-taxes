// src/app/components/IssueTaxProof.tsx
'use client';

import React, { useState } from 'react';
import { getGameTaxSigner } from '@/utils/contract';
import { publicClient } from '@/utils/viem';

export default function IssueTaxProof() {
  const [busy, setBusy] = useState(false);
  const [proofHash, setProofHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIssue = async () => {
    setBusy(true);
    setError(null);
    try {
      const ctr = await getGameTaxSigner();

      // 1) Do the “record” call
      const txHash1 = await ctr.write.recordTransaction({
        args: [
          0,                   // Income=0, Expense=1, CapitalGain=2
          BigInt(123),         // example itemId
          BigInt(456)          // example price
        ]
      });

      // 2) Wait for it to be mined
      const receipt1 = await publicClient.waitForTransactionReceipt({ hash: txHash1 });
      const realTxHash = receipt1.transactionHash;
      console.log('Recorded tx:', realTxHash);

      // 3) Issue proof using that same hash
      const txHash2 = await ctr.write.issueTaxProof({ args: [realTxHash] });

      // 4) Wait for that proof-event tx too (optional)
      await publicClient.waitForTransactionReceipt({ hash: txHash2 });
      setProofHash(realTxHash);
    } catch (e: any) {
      console.error('Proof issuance error:', e);
      setError(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="text-lg font-bold">🔖 Record & Issue Proof</h2>

      <button
        onClick={handleIssue}
        disabled={busy}
        className="bg-purple-500 text-white px-3 py-1 rounded"
      >
        {busy ? 'Working…' : 'Record & Issue Proof'}
      </button>

      {proofHash && (
        <p className="text-green-400">
          ✅ Proof issued for tx <code>{proofHash}</code>
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
