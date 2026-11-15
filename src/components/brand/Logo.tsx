import { cn } from '@/lib/utils';
import { LOGO_GREY, LOGO_RED, LOGO_VIEWBOX } from './logo-paths';

type Props = { className?: string; title?: string; mono?: boolean };

/** Logo originale RGR Architetti, vettorializzato dal PNG del sito attuale. */
export function Logo({ className, title = 'RGR Architetti', mono }: Props) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={cn('block h-auto', className)} role="img" aria-label={title}>
      {LOGO_GREY.map((d, i) => (
        <path key={'g' + i} d={d} fill={mono ? 'currentColor' : 'var(--rgr-grey)'} fillRule="evenodd" />
      ))}
      {LOGO_RED.map((d, i) => (
        <path key={'r' + i} d={d} fill={mono ? 'currentColor' : 'var(--rgr-red)'} fillRule="evenodd" />
      ))}
    </svg>
  );
}
