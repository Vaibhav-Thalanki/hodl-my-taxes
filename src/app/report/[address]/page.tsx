'use client';

import { useParams }            from 'next/navigation';
import React from 'react';
import UserReport               from '../../components/UserReport';

/**
 * ReportPage Component
 * 
 * Renders a tax report page for a specific Ethereum address.
 * The address is extracted from the URL parameters.
 * 
 * @returns {JSX.Element} The rendered report page component
 */
export default function ReportPage() {
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
