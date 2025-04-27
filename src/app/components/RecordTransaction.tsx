// src/app/components/RecordTransaction.tsx
'use client';

import React, { useState } from 'react';
import { getGameTaxSigner } from '../../utils/contract';
import { v4 as uuidv4 } from 'uuid';

// Mirror the Solidity enum order:
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
  const rate = TAX_RATES[category] || 0;
  const netPrice = Math.floor(priceVal * (100 - rate) / 100);

  const record = async () => {
    const ctr = await getGameTaxSigner();

    // generate a unique proof key
    const proofKey = uuidv4();

    // single atomic call: record + proof
    await ctr.write.recordAndProof({
      args: [
        category,             // 0=Income,1=Expense,2=CapitalGain
        BigInt(itemId),       // your item ID
        BigInt(netPrice),     // the post-tax price
        proofKey              // unique proof string
      ]
    });

    alert(
      `✅ Recorded on-chain with proof!\n` +
      `• Proof Key: ${proofKey}\n` +
      `• Tax Rate: ${rate}%\n` +
      `• Net Price: ${netPrice}`
    );
  };

  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="font-bold mb-2">Record In-Game Tx</h2>
      <div className="flex items-center gap-2">
        {/* Category dropdown */}
        <select
          value={category}
          onChange={e => setCategory(Number(e.target.value) as Category)}
          className="border p-1 rounded"
        >
          <option value={Category.Income}>Income</option>
          <option value={Category.Expense}>Expense</option>
          <option value={Category.CapitalGain}>Capital Gain</option>
        </select>

        {/* Item ID */}
        <input
          type="number"
          placeholder="Item ID"
          value={itemId}
          onChange={e => setItemId(e.target.value)}
          className="border p-1 rounded"
        />

        {/* Original Price */}
        <input
          type="number"
          placeholder="Original Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border p-1 rounded"
        />

        {/* Read-only Tax Rate */}
        <input
          type="text"
          value={`${rate}% tax`}
          readOnly
          disabled
          className="w-24 border p-1 rounded bg-gray-200 text-gray-700 text-center cursor-not-allowed"
        />

        {/* Net Price */}
        <input
          type="text"
          value={netPrice}
          readOnly
          disabled
          className="w-24 border p-1 rounded bg-gray-100 text-gray-900 text-center cursor-not-allowed"
        />

        {/* Submit */}
        <button
          onClick={record}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Record
        </button>
      </div>
    </div>
  );
}
