import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Img } from '@/data/content';
import { lenisStore } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Props = { images: Img[]; index: number | null; onChange: (i: number | null) => void; title: string };

export function Lightbox({ images, index, onChange, title }: Props) {
  const open = index !== null;
  const closeBtn = useRef<HTMLButtonElement>(null);
  const startX = useRef<number | null>(null);
  const go = useCallback((d: number) => index !== null && onChange((index + d + images.length) % images.length), [index, images.length, onChange]);

  useEffect(() => {
    if (!open) return;
    lenisStore.current?.stop();
    document.documentElement.style.overflow = 'hidden';
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', k);
    return () => {
      window.removeEventListener('keydown', k);
      lenisStore.current?.start();
      document.documentElement.style.overflow = '';
      prev?.focus();
    };
  }, [open, go, onChange]);

  const img = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, galleria`}
          className="fixed inset-0 z-[90] flex flex-col bg-[#0f0f0f] text-white"
          initial={{ clipPath: 'inset(50% 0 50% 0)' }}
          animate={{ clipPath: 'inset(0% 0 0% 0)' }}
          exit={{ clipPath: 'inset(50% 0 50% 0)' }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-8">
            <p className="font-nav text-sm tabular-nums">
              <span className="text-primary">{String(index! + 1).padStart(2, '0')}</span>
              <span className="text-white/50"> / {String(images.length).padStart(2, '0')}</span>
              <span className="ml-4 hidden text-white/60 sm:inline">{title}</span>
            </p>
            <button ref={closeBtn} type="button" onClick={() => onChange(null)} className="flex h-11 w-11 items-center justify-center hover:text-primary" aria-label="Chiudi la galleria">
              <X className="size-6" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20"
            onPointerDown={(e) => (startX.current = e.clientX)}
            onPointerUp={(e) => {
              if (startX.current === null) return;
              const dx = e.clientX - startX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              startX.current = null;
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={img.src}
                src={img.src}
                alt={`${title}, foto ${index! + 1}`}
                className="max-h-full max-w-full select-none object-contain"
                draggable={false}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
            <button type="button" onClick={() => go(-1)} aria-label="Foto precedente" className="absolute left-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/20 hover:border-primary hover:text-primary sm:flex">
              <ChevronLeft />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Foto successiva" className="absolute right-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/20 hover:border-primary hover:text-primary sm:flex">
              <ChevronRight />
            </button>
          </div>

          <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:justify-center sm:px-8">
            {images.map((im, i) => (
              <button
                key={im.src}
                type="button"
                onClick={() => onChange(i)}
                aria-label={`Foto ${i + 1}`}
                aria-current={i === index}
                className={cn('h-14 w-14 shrink-0 overflow-hidden border-2 transition-all', i === index ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100')}
              >
                <img src={im.thumb ?? im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
