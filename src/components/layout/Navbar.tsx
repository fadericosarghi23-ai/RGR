import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/button-link';
import { nav, type NavItem } from '@/data/nav';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const loc = useLocation();
  const isHome = loc.pathname === '/';
  const [pastHero, setPastHero] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setPastHero(y > window.innerHeight * 0.55);
    setHidden(y > 240 && y > prev && !open && !mobile);
  });

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [loc.pathname]);

  return (
    <>
      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500',
          (solid && (!isHome || pastHero)) || open ? 'bg-white/92 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md' : 'bg-transparent',
        )}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_EXPO }}
        onMouseLeave={() => setOpen(null)}
      >
        <div className="container-rgr flex h-[76px] items-center justify-between gap-6 lg:h-[88px]">
          <Link to="/" aria-label="RGR Architetti, torna alla home" className="relative z-10 flex h-12 shrink-0 items-center">
            <Logo className={cn('w-[104px] transition-all duration-700 lg:w-[124px]', isHome && !pastHero && !mobile ? 'pointer-events-none -translate-y-2 opacity-0' : 'opacity-100')} />
          </Link>

          <nav aria-label="Principale" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <DesktopItem key={item.to} item={item} open={open === item.to} setOpen={setOpen} />
            ))}
            <ButtonLink to="/contatti" size="sm" className="ml-4">
              Contatti
            </ButtonLink>
          </nav>

          <button
            type="button"
            className="relative z-[70] -mr-2 flex h-12 w-12 items-center justify-center lg:hidden"
            aria-label={mobile ? 'Chiudi il menu' : 'Apri il menu'}
            aria-expanded={mobile}
            aria-controls="menu-mobile"
            onClick={() => setMobile((m) => !m)}
          >
            <span className="relative block h-3 w-7">
              <span className={cn('absolute left-0 top-0 h-px w-full bg-rgr-black transition-transform duration-500', mobile && 'translate-y-[6px] rotate-45')} />
              <span className={cn('absolute bottom-0 left-0 h-px bg-rgr-black transition-all duration-500', mobile ? 'w-full -translate-y-[5px] -rotate-45' : 'w-4/6')} />
            </span>
          </button>
        </div>

        <AnimatePresence>
          {open && <MegaPanel item={nav.find((n) => n.to === open)!} onClose={() => setOpen(null)} />}
        </AnimatePresence>
      </motion.header>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}

function DesktopItem({ item, open, setOpen }: { item: NavItem; open: boolean; setOpen: (v: string | null) => void }) {
  const loc = useLocation();
  const active = loc.pathname === item.to || loc.pathname.startsWith(item.to + '/');
  const base = 'font-nav text-[0.8rem] uppercase tracking-[0.18em] text-rgr-black transition-colors hover:text-primary';
  if (!item.children)
    return (
      <NavLink to={item.to} onMouseEnter={() => setOpen(null)} className={cn(base, 'px-4 py-2')}>
        <span className={cn('link-draw pb-1', active && 'text-primary')} aria-current={active ? 'page' : undefined}>
          {item.label}
        </span>
      </NavLink>
    );
  return (
    <div className="relative flex items-center" onMouseEnter={() => setOpen(item.to)}>
      <NavLink to={item.to} className={cn(base, 'py-2 pl-4 pr-1')}>
        <span className={cn('link-draw pb-1', active && 'text-primary')} aria-current={active ? 'page' : undefined}>
          {item.label}
        </span>
      </NavLink>
      <button
        type="button"
        aria-label={`Apri il sottomenu ${item.label}`}
        aria-expanded={open}
        className="p-2 text-rgr-black hover:text-primary"
        onClick={() => setOpen(open ? null : item.to)}
      >
        <ChevronDown className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')} />
      </button>
    </div>
  );
}

function MegaPanel({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [hover, setHover] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  const children = item.children ?? [];
  const img = children[hover]?.image;
  return (
    <motion.div
      ref={ref}
      key={item.to}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
      className="absolute inset-x-0 top-full hidden border-t border-border bg-white lg:block"
    >
      <div className="container-rgr grid grid-cols-12 gap-8 py-10">
        <div className="col-span-3">
          <p className="label-tech">{item.label}</p>
          <Link to={item.to} className="mt-4 inline-block font-display text-3xl font-bold text-rgr-black hover:text-primary">
            Vedi tutti
          </Link>
          <motion.span
            className="mt-6 block h-px w-24 origin-left bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
        <ul className="col-span-5">
          {children.map((c, i) => (
            <motion.li
              key={c.to}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: EASE_EXPO }}
            >
              <NavLink
                to={c.to}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-baseline gap-5 border-b border-border py-3 font-display text-xl font-medium text-rgr-black transition-colors hover:text-primary',
                    isActive && 'text-primary',
                  )
                }
              >
                <span className="label-tech w-8 text-xs md:text-[0.65rem]">{c.meta}</span>
                <span className="transition-transform duration-500 group-hover:translate-x-2">{c.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
        <div className="col-span-4">
          <div className="relative aspect-[4/3] overflow-hidden bg-rgr-paper-2">
            <AnimatePresence mode="popLayout">
              {img && (
                <motion.img
                  key={img}
                  src={img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ clipPath: 'inset(0 0 0 100%)', scale: 1.15 }}
                  animate={{ clipPath: 'inset(0 0 0 0%)', scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
