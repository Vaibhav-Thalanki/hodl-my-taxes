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

/**
 * ProofLookup Component
 * 
 * A React component that allows users to look up ownership information
 * using proof metadata. It displays the owner's address if found or
 * shows appropriate error messages.
 */
export default function ProofLookup() {
    /** Stores the proof metadata input by the user */
    const [proof, setProof] = useState('');
    /** Stores the owner's address once found */
    const [owner, setOwner] = useState<string | null>(null);
    /** Stores error messages if lookup fails */
    const [error, setError] = useState<string | null>(null);
    /** Indicates if a lookup operation is in progress */
    const [busy, setBusy] = useState(false);

    /**
     * Performs the proof ownership lookup
     * Queries the smart contract to find the owner of the provided proof
     * Updates the UI state based on the response
     */
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
