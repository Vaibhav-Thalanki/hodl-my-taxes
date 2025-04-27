'use client';

import React, { useState } from 'react';
import { getGameTaxSigner } from '@/utils/contract';
import { publicClient } from '@/utils/viem';

export default function FileTax() {
    const [rate, setRate] = useState('10');
    const [deduction, setDeduction] = useState<string>();
    const [busy, setBusy] = useState(false);

    const handleFile = async () => {
        setBusy(true);
        try {
            const ctr = await getGameTaxSigner();

            // 1) Send fileTax(rate)
            const txHash = await ctr.write.fileTax({ args: [BigInt(rate)] });
            await publicClient.waitForTransactionReceipt({ hash: txHash });

            // 2) Read back what was stored
            const taxAmount = await ctr.read.getTaxDeduction({ args: [ctr.address] });
            setDeduction(taxAmount.toString());
        } catch (e: any) {
            console.error('fileTax error', e);
            alert('Failed to file tax: ' + (e.message || e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="p-4 border rounded space-y-2">
            <h2 className="text-lg font-bold">💰 File Tax</h2>
            <label className="block">
                Rate (%):
                <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    className="ml-2 w-16 border p-1 rounded"
                />
            </label>
            <button
                onClick={handleFile}
                disabled={busy}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
                {busy ? 'Filing…' : 'File Tax'}
            </button>
            {deduction != null && (
                <p className="mt-2 text-green-400">
                    📄 Tax Deducted: {deduction} WND
                </p>
            )}
        </div>
    );
}
