'use client';

/**
 * @fileoverview IRS View component for auditing user reports and verifying proofs
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGameTaxContract } from '@/utils/contract';
import ProofLookup from './ProofLookup';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

/**
 * IRSView Component
 * Displays a list of registered users and provides access to their tax reports
 * Also includes functionality to lookup and verify zero-knowledge proofs
 * @returns {JSX.Element} The rendered IRS view component
 */
export default function IRSView() {
    /** Array of user addresses */
    const [users, setUsers] = useState<string[]>([]);
    /** Loading state for user data fetching */
    const [loading, setLoading] = useState(true);
    /** Error state for handling fetch failures */
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const ctr = getGameTaxContract();
                const raw = await ctr.read.getUserCount({ args: [] });
                const count = Number(raw);

                const list: string[] = [];
                for (let i = 0; i < count; i++) {
                    const addr = await ctr.read.getUser({ args: [BigInt(i)] });
                    list.push(addr);
                }
                setUsers(list);
            } catch (e: any) {
                console.error('Failed to load users:', e);
                setError('Could not load user list.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>🔎 IRS Audit View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <p>Loading users…</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : users.length === 0 ? (
                    <p>No recorded users yet.</p>
                ) : (
                    users.map((addr) => (
                        <div
                            key={addr}
                            className="flex items-center justify-between space-x-4"
                        >
                            <span className="font-mono text-sm">{addr}</span>
                            <Button
                                asChild
                                size="sm"
                                variant="default"
                            >
                                <Link href={`/report/${addr}`}>View Report</Link>
                            </Button>
                        </div>
                    ))
                )}

                <Separator />

                <ProofLookup />
            </CardContent>
        </Card>
    );
}
