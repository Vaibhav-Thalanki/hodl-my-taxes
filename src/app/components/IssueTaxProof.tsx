'use client';

import React, { useState } from 'react';
import { getGameTaxSigner } from '@/utils/contract';
import { v4 as uuidv4 }     from 'uuid';

export default function IssueTaxProof() {
  const [busy, setBusy]       = useState(false);
  const [proofKey, setProofKey] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const handleProofOnly = async () => {
    setBusy(true);
    setError(null);

    try {
      const ctr = await getGameTaxSigner();
      const key = uuidv4();                     // unique proof key

      // <-- This is the ONLY call now:
      await ctr.write.issueTaxProof({ args: [key] });

      setProofKey(key);
    } catch (e: any) {
      console.error('Proof issuance error:', e);
      setError(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="text-lg font-bold">🔖 Issue Proof Only</h2>
      <button
        onClick={handleProofOnly}
        disabled={busy}
        className="bg-purple-500 text-white px-3 py-1 rounded"
      >
        {busy ? 'Working…' : 'Issue Proof'}
      </button>
      {proofKey && (
        <p className="text-green-400">
          ✅ Proof key: <code>{proofKey}</code>
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
