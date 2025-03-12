"use client";

import dynamic from 'next/dynamic';

const ClientQuoteBox = dynamic(
  () => import('./ClientBox'),
  {
    ssr: false,
    loading: () => <div className="glass h-20 mb-8 rounded-lg animate-pulse" />
  }
);

export default function QuoteBox() {
  return <ClientQuoteBox />;
}
