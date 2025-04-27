'use client';

import React, { useState } from 'react';
import { publicClient, getWalletClient } from '../../utils/viem';
import { getGameTaxContract }           from '../../utils/contract';

export default function TaxReport() {
  const [busy, setBusy] = useState(false);

  const generateCSV = async () => {
    setBusy(true);
    // 1. Get your wallet/account
    const walletClient = await getWalletClient();
    const account      = walletClient.account.address;

    // 2. Grab the contract instance
    const contract = getGameTaxContract();

    // 3. Query how many txs you have
    const countBig = await contract.read.getTransactionCount({
      args: [account]
    });
    const count = Number(countBig);

    // 4. Build rows: header + each transaction
    const rows: string[][] = [
      ['Category','ItemID','Price','Timestamp']
    ];

    for (let i = 0; i < count; i++) {
      const [cat, itemId, price, ts] = await contract.read.getTransaction({
        args: [account, BigInt(i)]
      });

      rows.push([
        cat.toString(),
        itemId.toString(),
        price.toString(),
        new Date(Number(ts) * 1000).toISOString()
      ]);
    }

    // 5. Convert to CSV text
    const csvText = rows.map(r => r.join(',')).join('\n');

    // 6. Download it
    const blob = new Blob([csvText], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'tax_report.csv';
    a.click();

    setBusy(false);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-2">📄 Download Tax Report</h2>
      <button
        onClick={generateCSV}
        disabled={busy}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        {busy ? 'Generating…' : 'Generate & Download CSV'}
      </button>
    </div>
  );
}
