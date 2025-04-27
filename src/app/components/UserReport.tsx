'use client';

import React, { useState } from 'react';
import { getGameTaxContract } from '@/utils/contract';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Props for the UserReport component
 * @interface UserReportProps
 * @property {string} address - The wallet address for which to generate the tax report
 */
interface UserReportProps {
    address: string;
}

/**
 * UserReport component allows users to download their transaction history as a CSV file
 * and displays any errors that occur during the process
 * @param {UserReportProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function UserReport({ address }: UserReportProps) {
    const [busy, setBusy] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * Generates and downloads a CSV file containing the user's transaction history
     * The CSV includes category, item ID, price, and timestamp for each transaction
     */
    const generateCSV = async () => {
        setBusy(true);
        try {
            const ctr = getGameTaxContract();
            const countBig = await ctr.read.getTransactionCount({ args: [address] });
            const count = Number(countBig);

            const rows: string[][] = [['Category', 'ItemID', 'Price', 'Timestamp']];
            for (let i = 0; i < count; i++) {
                const [cat, itemId, price, ts] = await ctr.read.getTransaction({
                    args: [address, BigInt(i)],
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
            a.download = `tax_report_${address}.csv`;
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
                        {busy ? 'Generating…' : `Download CSV for ${address}`}
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
