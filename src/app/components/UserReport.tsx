'use client';

import React, { useState } from 'react';
import { publicClient } from '../../utils/viem';
import { getGameTaxContract } from '../../utils/contract';

interface UserReportProps {
    address: string;
}

export default function UserReport({ address }: UserReportProps) {
    const [busy, setBusy] = useState(false);

    const generateCSV = async () => {
        setBusy(true);
        const ctr = getGameTaxContract();

        // read how many transactions this user has
        const countBig = await ctr.read.getTransactionCount({ args: [address] });
        const count = Number(countBig);

        // build rows
        const rows: string[][] = [['Category', 'ItemID', 'Price', 'Timestamp']];
        for (let i = 0; i < count; i++) {
            const [cat, itemId, price, ts] = await ctr.read.getTransaction({
                args: [address, BigInt(i)]
            });
            rows.push([
                cat.toString(),
                itemId.toString(),
                price.toString(),
                new Date(Number(ts) * 1000).toISOString()
            ]);
        }

        // download CSV
        const csvText = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csvText], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tax_report_${address}.csv`;
        a.click();

        setBusy(false);
    };

    return (
        <div className="p-4 border rounded">
            <button
                onClick={generateCSV}
                disabled={busy}
                className="bg-green-500 text-white px-3 py-1 rounded"
            >
                {busy ? 'Generating…' : 'Download CSV for this user'}
            </button>
        </div>
    );
}
