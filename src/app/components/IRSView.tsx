'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGameTaxContract } from '@/utils/contract';
import ProofLookup from './ProofLookup';

export default function IRSView() {
    const [users, setUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const ctr = getGameTaxContract();
                // 1) How many users?
                const rawCount = await ctr.read.getUserCount({ args: [] });
                console.log('Raw count:', rawCount);
                const count = Number(rawCount);
                console.log('User count:', count);

                // 2) Fetch each user
                const list: string[] = [];
                for (let i = 0; i < count; i++) {
                    const addr = await ctr.read.getUser({ args: [BigInt(i)] });
                    console.log(`User[${i}] =`, addr);
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

    if (loading) {
        return <p>Loading users…</p>;
    }
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-4 border rounded space-y-2">
            <h2 className="text-lg font-bold">🔎 IRS Audit View</h2>

            {users.length === 0 ? (
                <p>No recorded users yet.</p>
            ) : (
                users.map((addr) => (
                    <div key={addr} className="flex justify-between items-center">
                        <span className="font-mono">{addr}</span>
                        <Link
                            href={`/report/${addr}`}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                            View Report
                        </Link>
                    </div>
                ))
            )}

            <hr className="my-4" />
            <ProofLookup />
        </div>
    );
}
