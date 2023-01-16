'use client';
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsWrapper() {
  return <Analytics debug={false} beforeSend={({ type, url }) => 
    ({ type, url: new URL(url).href == '/' ? url : new URL(url).origin })}/>;
}