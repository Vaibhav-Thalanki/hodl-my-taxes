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

/**
 * TaxReport Component
 * Generates and downloads a CSV report of game transactions for tax purposes.
 * The report includes transaction categories, item IDs, prices, and timestamps.
 */
export default function TaxReport() {
    const [busy, setBusy] = useState(false);

    /**
     * Generates and downloads a CSV file containing the user's transaction history.
     * The CSV includes columns for Category, ItemID, Price, and Timestamp.
     * File is named as tax_report_[userAddress].csv
     */
    const generateCSV = async () => {
        setBusy(true);
        try {
            const walletClient = await getWalletClient();
            const account = walletClient.account.address;

            const contract = getGameTaxContract();

            const countBig = await contract.read.getTransactionCount({
                args: [account],
            });
            const count = Number(countBig);

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

            const csvText = rows.map(r => r.join(',')).join('\n');

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
