'use client';

import React, { useState } from 'react';
import { publicClient, getWalletClient } from '@/utils/viem';
import { getGameTaxSigner } from '@/utils/contract';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

/**
 * FileTax Component
 * Allows users to file taxes by specifying a tax rate and displays the deducted amount.
 * Handles blockchain interactions for tax filing through a smart contract.
 */
export default function FileTax() {
    /** Tax rate percentage, defaults to 10% */
    const [rate, setRate] = useState('10');
    /** Amount deducted after tax filing */
    const [deduction, setDeduction] = useState<string>();
    /** Loading state during transaction processing */
    const [busy, setBusy] = useState(false);
    /** Stores error message if transaction fails */
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * Handles the tax filing process
     * 1. Calls the smart contract's fileTax function with the specified rate
     * 2. Waits for transaction confirmation
     * 3. Retrieves and displays the tax deduction amount
     */
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
            setErrorMsg('Failed to file tax: ' + (e.message || e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>💰 File Tax</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="rate" className="min-w-[4rem]">
                            Rate (%)
                        </Label>
                        <Input
                            id="rate"
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            className="w-20"
                        />
                    </div>

                    <Button
                        onClick={handleFile}
                        disabled={busy}
                        variant="default"
                    >
                        {busy ? 'Filing…' : 'File Tax'}
                    </Button>

                    {deduction && (
                        <p className="text-green-500">
                            📄 Tax Deducted: <strong>{deduction} WND</strong>
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Error Dialog */}
            <Dialog open={!!errorMsg} onOpenChange={(open) => !open && setErrorMsg(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>⚠️ Error</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <p className="text-sm">{errorMsg}</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setErrorMsg(null)}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
