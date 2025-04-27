'use client';

import React, { useState } from 'react';
import { publicClient, getWalletClient } from '@/utils/viem';
import { getGameTaxContract } from '@/utils/contract';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TaxReport() {
    const [busy, setBusy] = useState(false);

    const generateCSV = async () => {
        setBusy(true);
        try {
            // 1. Get your wallet/account
            const walletClient = await getWalletClient();
            const account = walletClient.account.address;

            // 2. Grab the contract instance
            const contract = getGameTaxContract();

            // 3. Query how many txs you have
            const countBig = await contract.read.getTransactionCount({
                args: [account],
            });
            const count = Number(countBig);

            // 4. Build rows: header + each transaction
            const rows: string[][] = [
                ['Category', 'ItemID', 'Price', 'Timestamp'],
            ];
            for (let i = 0; i < count; i++) {
                const [cat, itemId, price, ts] = await contract.read.getTransaction({
                    args: [account, BigInt(i)],
                });
                rows.push([
                    cat.toString(),
                    itemId.toString(),
                    price.toString(),
                    new Date(Number(ts) * 1000).toISOString(),
                ]);
            }

            // 5. Convert to CSV text
            const csvText = rows.map(r => r.join(',')).join('\n');

            // 6. Trigger download
            const blob = new Blob([csvText], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tax_report_${account}.csv`;
            a.click();
        } catch (e) {
            console.error('CSV generation error', e);
            alert('Failed to generate report.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>📄 Download Tax Report</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={generateCSV} disabled={busy} variant="default" className="w-full">
                    {busy ? 'Generating…' : 'Generate & Download CSV'}
                </Button>
            </CardContent>
        </Card>
    );
}
