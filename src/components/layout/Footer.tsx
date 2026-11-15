import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { site, phoneHref } from '@/data/content';
import { nav } from '@/data/nav';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-rgr-footer text-white">
      <div className="container-rgr pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label-tech !text-rgr-footer-link">Parliamo del Suo progetto</p>
            <Link to="/contatti" className="group mt-5 inline-flex items-end gap-4 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-white">
              <span>
                Scriva
                <br />
                allo studio
              </span>
              <ArrowUpRight className="mb-2 size-10 text-primary transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2 lg:size-14" />
            </Link>
            <motion.span
              className="mt-10 block h-px w-full max-w-md origin-left bg-primary"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-6">
            <div>
              <p className="label-tech !text-rgr-footer-link">Studio</p>
              <address className="mt-4 not-italic leading-relaxed">
                {site.address.street}
                <br />
                {site.address.cap} {site.address.city}
              </address>
              <p className="mt-2 leading-relaxed sm:mt-4">
                <a href={phoneHref} className="inline-block py-2 text-white hover:text-primary sm:py-0">
                  {site.phone}
                </a>
                <br />
                <a href={`mailto:${site.email}`} className="inline-block break-all py-2 text-white hover:text-primary sm:py-0">
                  {site.email}
                </a>
              </p>
            </div>
            <div>
              <p className="label-tech !text-rgr-footer-link">Sito</p>
              <ul className="mt-2 grid grid-cols-2 sm:mt-4 sm:grid-cols-1 sm:space-y-1.5">
                <li>
                  <Link to="/" className="inline-block py-2.5 text-rgr-footer-link hover:text-white sm:py-0">
                    Home
                  </Link>
                </li>
                {nav.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="inline-block py-2.5 text-rgr-footer-link hover:text-white sm:py-0">
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/contatti" className="inline-block py-2.5 text-rgr-footer-link hover:text-white sm:py-0">
                    Contatti
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="label-tech !text-rgr-footer-link">Architette</p>
              <ul className="mt-4 space-y-4 text-sm">
                {site.partners.map((p) => (
                  <li key={p.piva}>
                    <span className="block text-white">{p.name}</span>
                    <span className="block text-rgr-footer-link">P.IVA {p.piva}</span>
                    <a href={`mailto:${p.email}`} className="block break-all py-2 text-rgr-footer-link hover:text-white sm:py-0">
                      {p.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 py-8 text-sm text-rgr-footer-link md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Logo className="w-[86px] opacity-90" />
            <span>© {year} RGR Architetti</span>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="py-3 hover:text-white md:py-0">
              Privacy
            </Link>
            <Link to="/cookie" className="py-3 hover:text-white md:py-0">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
