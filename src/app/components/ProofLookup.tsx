'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getGameTaxContract } from '@/utils/contract';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProofLookup() {
    const [proof, setProof] = useState('');
    const [owner, setOwner] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const lookup = async () => {
        setBusy(true);
        setError(null);
        setOwner(null);
        try {
            const ctr = getGameTaxContract();
            const who = await ctr.read.getProofOwner({ args: [proof] });
            if (who === '0x0000000000000000000000000000000000000000') {
                setError('No proof found for that code');
            } else {
                setOwner(who);
            }
        } catch (e) {
            setError('Lookup failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>🔑 Lookup by Proof Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* input + button */}
                <div className="flex space-x-2">
                    <Input
                        placeholder="Enter proof metadata"
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        className="flex-1"
                        disabled={busy}
                    />
                    <Button
                        onClick={lookup}
                        disabled={busy || !proof}
                        variant="default"
                    >
                        {busy ? 'Searching…' : 'Find User'}
                    </Button>
                </div>

                <Separator />

                {/* Results */}
                {owner && (
                    <p className="flex items-center space-x-2">
                        <span>Found user:</span>
                        <Button asChild variant="link" size="sm">
                            <Link href={`/report/${owner}`}>{owner}</Link>
                        </Button>
                    </p>
                )}
                {error && <p className="text-red-500">{error}</p>}
            </CardContent>
        </Card>
    );
}
