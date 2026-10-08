import type { SVGProps } from 'react';

export function AutoplayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 12a11.5 11.5 0 0 1 21-3M26 4v5h-5" />
      <path d="M27 20A11.5 11.5 0 0 1 6 23M6 28v-5h5" />
      <path d="m12.5 21 3.5-10 3.5 10M14 17h4" />
    </svg>
  );
}
