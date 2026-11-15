import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { nav } from '@/data/nav';
import { site, phoneHref } from '@/data/content';
import { EASE_EXPO, lenisStore } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      lenisStore.current?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenisStore.current?.start();
      document.documentElement.style.overflow = '';
      setSub(null);
    }
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  const items = [...nav, { to: '/contatti', label: 'Contatti' }];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="paper-grid fixed inset-0 z-[60] flex flex-col overflow-y-auto lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
        >
          <motion.span
            aria-hidden
            className="absolute left-0 top-[76px] h-px w-full origin-left bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
          />
          <nav aria-label="Menu mobile" className="mt-[100px] flex-1 px-5">
            <ul>
              {items.map((it, i) => (
                <motion.li
                  key={it.to}
                  className="border-b border-border"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: EASE_EXPO }}
                >
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={it.to}
                      onClick={onClose}
                      className={({ isActive }) => cn('block py-4 font-display text-[2rem] font-bold leading-none text-rgr-black', isActive && 'text-primary')}
                    >
                      {it.label}
                    </NavLink>
                    {'children' in it && it.children && (
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center"
                        aria-expanded={sub === it.to}
                        aria-label={`Mostra ${it.label}`}
                        onClick={() => setSub(sub === it.to ? null : it.to)}
                      >
                        <Plus className={cn('size-5 transition-transform duration-500', sub === it.to && 'rotate-45 text-primary')} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {'children' in it && it.children && sub === it.to && (
                      <motion.ul
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.5, ease: EASE_EXPO }}
                        className="overflow-hidden"
                      >
                        {it.children.map((c) => (
                          <li key={c.to}>
                            <Link to={c.to} onClick={onClose} className="flex items-baseline gap-4 py-2.5 pl-1 text-lg text-rgr-ink">
                              <span className="label-tech w-7 text-xs md:text-[0.62rem]">{c.meta}</span>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li className="h-4" />
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="space-y-1 px-5 pb-8 pt-8 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="label-tech">Bergamo</p>
            <p>
              {site.address.street}, {site.address.cap} {site.address.city}
            </p>
            <p>
              <a href={phoneHref} className="text-rgr-black">
                {site.phone}
              </a>
              {'  ·  '}
              <a href={`mailto:${site.email}`} className="text-rgr-black">
                {site.email}
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
