'use client';

import React, { useState } from 'react';
import { getGameTaxSigner } from '@/utils/contract';
import { publicClient } from '@/utils/viem';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

/**
 * FileTax Component
 * 
 * A React component that allows users to file tax transactions on the blockchain.
 * Users can specify a tax rate percentage and submit the transaction.
 * The component displays the deducted tax amount after successful submission.
 * 
 * @component
 * @returns {JSX.Element} A card interface for filing tax transactions
 */
export default function FileTax() {
    const [rate, setRate] = useState('10');
    const [deduction, setDeduction] = useState<string>();
    const [busy, setBusy] = useState(false);

    /**
     * Handles the tax filing process
     * Submits the tax rate to the blockchain and retrieves the deducted amount
     * 
     * @async
     * @throws {Error} When the tax filing transaction fails
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
            alert('Failed to file tax: ' + (e.message || e));
        } finally {
            setBusy(false);
        }
    };

    return (
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
    );
}