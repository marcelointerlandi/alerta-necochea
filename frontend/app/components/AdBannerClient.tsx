'use client';
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type AdBannerType from './AdBanner';

const AdBannerInner = dynamic(() => import('./AdBanner'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '160px', marginBottom: '24px', background: '#f9f8f5', border: '1px solid #e2e0da' }} />
  ),
});

export default function AdBannerClient(props: ComponentProps<typeof AdBannerType>) {
  if (props.variant === 'main') {
    return (
      <div style={{ borderTop: '1px solid #e2e0da', borderBottom: '1px solid #e2e0da' }}>
        <AdBannerInner {...props} />
      </div>
    );
  }
  return <AdBannerInner {...props} />;
}
