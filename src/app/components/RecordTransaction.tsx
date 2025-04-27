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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// Mirror the Solidity enum:
enum Category {
  Income = 0,
  Expense = 1,
  CapitalGain = 2,
}

// Fixed tax rates per category
const TAX_RATES: Record<Category, number> = {
  [Category.Income]: 30,
  [Category.Expense]: 0,
  [Category.CapitalGain]: 20,
};

export default function RecordTransaction() {
  const [category, setCategory] = useState<Category>(Category.Income);
  const [itemId, setItemId] = useState('');
  const [price, setPrice] = useState('');

  // Compute net price after tax deduction
  const priceVal = Number(price) || 0;
  const rate = TAX_RATES[category];
  const netPrice = Math.floor(priceVal * (100 - rate) / 100);

  const record = async () => {
    const ctr = await getGameTaxSigner();
    const proofKey = uuidv4();

    await ctr.write.recordAndProof({
      args: [
        category,           // enum index
        BigInt(itemId),     // Item ID
        BigInt(netPrice),   // post-tax price
        proofKey,           // proof key
      ],
    });

    alert(`✅ Recorded on-chain with proof!
• Proof Key: ${proofKey}
• Tax Rate: ${rate}%
• Net Price: ${netPrice}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record In-Game Transaction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={String(category)}
              onValueChange={(val) => setCategory(Number(val) as Category)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Income</SelectItem>
                <SelectItem value="1">Expense</SelectItem>
                <SelectItem value="2">Capital Gain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Item ID */}
          <div>
            <Label htmlFor="itemId">Item ID</Label>
            <Input
              id="itemId"
              type="number"
              placeholder="e.g. 123"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Original Price */}
          <div>
            <Label htmlFor="price">Original Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 200"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Net Price (read-only) */}
          <div>
            <Label>Net Price</Label>
            <Input
              readOnly
              value={netPrice.toString()}
              className="w-full bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              ({rate}% tax applied)
            </p>
          </div>
        </div>

        <Button onClick={record} variant="default" className="w-full">
          Record Transaction
        </Button>
      </CardContent>
    </Card>
  );
}
