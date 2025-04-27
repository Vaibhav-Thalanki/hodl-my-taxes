'use client';

import { useParams }            from 'next/navigation';
import React from 'react';
import UserReport               from '../../components/UserReport';

export default function ReportPage() {
  // grab the address from the URL
  const { address } = useParams(); 

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Tax Report for {address}
      </h1>
      <UserReport address={address!} />
    </main>
  );
}
