'use client';

import React, { useState }    from 'react';
import { getGameTaxSigner }   from '../../utils/contract';

export default function IssueTaxProof() {
  const [meta, setMeta] = useState('');

  const issueProof = async () => {
    if (!meta) {
      alert('Please enter some metadata (e.g. a report ID)');
      return;
    }
    const ctr = await getGameTaxSigner();
    await ctr.write.issueTaxProof({ args: [meta] });
    alert('✅ Tax-proof event emitted on-chain');
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-2">🔖 Issue Proof-of-Filing</h2>
      <input
        type="text"
        placeholder="Proof metadata"
        value={meta}
        onChange={e => setMeta(e.target.value)}
        className="border p-1 rounded mr-2"
      />
      <button
        onClick={issueProof}
        className="bg-purple-500 text-white px-3 py-1 rounded"
      >
        Issue Proof
      </button>
    </div>
  );
}
