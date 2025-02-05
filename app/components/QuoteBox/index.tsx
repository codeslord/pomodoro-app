"use client";

import dynamic from 'next/dynamic';

const ClientQuoteBox = dynamic(
  () => import('./ClientBox'),
  {
    ssr: false,
    loading: () => <div className="h-20 mb-8" />
  }
);

export default function QuoteBox() {
  return <ClientQuoteBox />;
}
