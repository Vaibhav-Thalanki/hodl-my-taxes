'use client';
import React, { useState } from 'react';
import { getGameTaxSigner } from '../../utils/contract';
// Mirror the Solidity enum order:
enum Category {
  Income = 0,
  Expense = 1,
  CapitalGain = 2,
}

export default function RecordTransaction() {
  const [category, setCategory] = useState<Category>(Category.Income);
  const [itemId, setItemId] = useState('');
  const [price, setPrice] = useState('');

  const record = async () => {
    const ctr = await getGameTaxSigner();
    await ctr.write.recordTransaction([
      category,
      BigInt(itemId),
      BigInt(price),
    ]);
    alert('✅ Transaction recorded on-chain');
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">Record In-Game Tx</h2>
      <select
        value={category}
        onChange={e => setCategory(Number(e.target.value) as Category)}
        className="border p-1 rounded"
      >
        <option value={0}>Income</option>
        <option value={1}>Expense</option>
        <option value={2}>CapitalGain</option>
      </select>
      <input
        type="number"
        placeholder="Item ID"
        value={itemId}
        onChange={e => setItemId(e.target.value)}
        className="border p-1 rounded mx-2"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="border p-1 rounded mx-2"
      />
      <button onClick={record} className="bg-blue-500 text-white px-2 py-1 rounded">
        Record
      </button>
    </div>
  );
}
