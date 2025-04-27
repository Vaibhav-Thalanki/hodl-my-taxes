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

/**
 * IssueTaxProof Component
 * 
 * A React component that allows users to issue tax proofs using a smart contract.
 * Displays a card with a button to trigger the proof issuance and shows the result
 * or any errors that occur during the process.
 */
export default function IssueTaxProof() {
  const [busy, setBusy] = useState(false);
  const [proofKey, setProofKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the issuance of a tax proof by generating a unique key and
   * interacting with the smart contract.
   * Sets the proofKey on success or displays an error message on failure.
   */
  const handleProofOnly = async () => {
    setBusy(true);
    setError(null);

    try {
      const ctr = await getGameTaxSigner();
      const key = uuidv4();

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
