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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

/**
 * TaxReport Component
 * Generates and downloads a CSV report of game transactions for tax purposes.
 * The report includes transaction categories, item IDs, prices, and timestamps.
 * @returns React component for generating tax reports
 */
export default function TaxReport() {
    const [busy, setBusy] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * Generates and downloads a CSV file containing transaction history
     * Fetches data from the GameTax smart contract for the connected wallet
     * CSV Format: Category, ItemID, Price, Timestamp
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
        } catch (e: any) {
            console.error('CSV generation error', e);
            setErrorMsg('Failed to generate report: ' + (e.message || e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>📄 Download Tax Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={generateCSV}
                        disabled={busy}
                        variant="default"
                        className="w-full"
                    >
                        {busy ? 'Generating…' : 'Generate & Download CSV'}
                    </Button>
                </CardContent>
            </Card>

            {/* Error Dialog */}
            <Dialog
                open={!!errorMsg}
                onOpenChange={(open) => !open && setErrorMsg(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>⚠️ Error</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 text-sm">{errorMsg}</div>
                    <DialogFooter>
                        <Button onClick={() => setErrorMsg(null)}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
