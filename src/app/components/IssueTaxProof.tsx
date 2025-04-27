'use client';

import React, { useState } from 'react';
import { getGameTaxSigner } from '@/utils/contract';
import { v4 as uuidv4 } from 'uuid';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function IssueTaxProof() {
  const [busy, setBusy] = useState(false);
  const [proofKey, setProofKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProofOnly = async () => {
    setBusy(true);
    setError(null);

    try {
      const ctr = await getGameTaxSigner();
      const key = uuidv4(); // unique proof key

      // only issue proof — no transaction recorded
      await ctr.write.issueTaxProof({ args: [key] });

      setProofKey(key);
    } catch (e: any) {
      console.error('Proof issuance error:', e);
      setError(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔖 Issue Proof Only</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleProofOnly}
          disabled={busy}
          variant="default"
        >
          {busy ? 'Working…' : 'Issue Proof'}
        </Button>

        {proofKey && (
          <p className="text-green-500">
            ✅ Proof key: <code>{proofKey}</code>
          </p>
        )}
        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
