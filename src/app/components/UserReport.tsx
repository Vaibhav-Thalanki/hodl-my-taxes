'use client';

import React, { useState } from 'react';
import { publicClient } from '@/utils/viem';
import { getGameTaxContract } from '@/utils/contract';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Props for the UserReport component
 */
interface UserReportProps {
    /** Ethereum address of the user */
    address: string;
}

/**
 * Component that generates and downloads a CSV report of user's game transactions
 * @param {UserReportProps} props - Component props
 * @returns {JSX.Element} Card component with download button
 */
export default function UserReport({ address }: UserReportProps) {
    const [busy, setBusy] = useState(false);

    /**
     * Generates and triggers download of CSV report containing user's transaction history
     * The CSV includes category, item ID, price, and timestamp for each transaction
     */
    const generateCSV = async () => {
        setBusy(true);
        try {
            const ctr = getGameTaxContract();
            const countBig = await ctr.read.getTransactionCount({ args: [address] });
            const count = Number(countBig);

            // Build CSV rows
            const rows: string[][] = [
                ['Category', 'ItemID', 'Price', 'Timestamp']
            ];
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

            // Trigger download
            const csvText = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csvText], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tax_report_${address}.csv`;
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
                <Button
                    onClick={generateCSV}
                    disabled={busy}
                    variant="default"
                >
                    {busy ? 'Generating…' : `Download CSV for ${address}`}
                </Button>
            </CardContent>
        </Card>
    );
}
