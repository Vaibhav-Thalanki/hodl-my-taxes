'use client';

import React, { useState } from 'react';
import { getGameTaxContract } from '@/utils/contract';
import Link from 'next/link';

export default function ProofLookup() {
    const [proof, setProof] = useState('');
    const [owner, setOwner] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const lookup = async () => {
        setBusy(true);
        setError(null);
        try {
            const ctr = getGameTaxContract();
            const who = await ctr.read.getProofOwner({ args: [proof] });
            if (who === '0x0000000000000000000000000000000000000000') {
                setError('No proof found for that code');
            } else {
                setOwner(who);
            }
        } catch (e: any) {
            setError('Lookup failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="p-4 border rounded space-y-2">
            <h2 className="text-lg font-bold">🔑 Lookup by Proof Code</h2>
            <input
                type="text"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="Enter proof metadata"
                className="border p-1 rounded w-full"
            />
            <button
                onClick={lookup}
                disabled={busy || !proof}
                className="bg-indigo-500 text-white px-3 py-1 rounded"
            >
                {busy ? 'Searching…' : 'Find User'}
            </button>

            {owner && (
                <p>
                    Found user:{' '}
                    <Link
                        href={`/report/${owner}`}
                        className="text-pink-400 underline"
                    >
                        {owner}
                    </Link>
                </p>
            )}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
