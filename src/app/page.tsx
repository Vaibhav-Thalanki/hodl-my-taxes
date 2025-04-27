'use client';

import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import RecordTransaction from './components/RecordTransaction';
import TaxReport from './components/TaxReport';
import IssueTaxProof from './components/IssueTaxProof';
import IRSView from './components/IRSView';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Home() {
  const [mode, setMode] = useState<'user' | 'irs'>('user');

  return (
    <main className="p-8 flex justify-center">
      {/* Centered container with max width */}
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold m-0">🧾 HODL My Taxes</h1>
            <div className="flex items-center space-x-4">
              <Tabs defaultValue={mode} onValueChange={setMode} className="space-x-2">
                <TabsList>
                  <TabsTrigger value="user">User View</TabsTrigger>
                  <TabsTrigger value="irs">IRS View</TabsTrigger>
                </TabsList>
              </Tabs>
              <ModeToggle />
            </div>
          </div>
        </Card>

        {/* Conditional content */}
        {mode === 'user' ? (
          <div className="space-y-4">
            {/* Connect Wallet */}
            <Card>
              <CardHeader><CardTitle>Connect Wallet</CardTitle></CardHeader>
              <CardContent><WalletConnect onConnect={() => { }} /></CardContent>
            </Card>

            {/* Record Transaction */}
            <Card>
              <CardHeader><CardTitle>Record Transaction</CardTitle></CardHeader>
              <CardContent><RecordTransaction /></CardContent>
            </Card>

            {/* Tax Report */}
            <Card>
              <CardHeader><CardTitle>Visualize & Download CSV</CardTitle></CardHeader>
              <CardContent><TaxReport /></CardContent>
            </Card>

            {/* Issue Proof */}
            <Card>
              <CardHeader><CardTitle>Issue Proof of Filing</CardTitle></CardHeader>
              <CardContent><IssueTaxProof /></CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader><CardTitle>IRS Audit View</CardTitle></CardHeader>
            <CardContent><IRSView /></CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
