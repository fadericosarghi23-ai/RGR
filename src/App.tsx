import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { ScrollTrigger, scrollToTop } from '@/lib/motion';
import Home from '@/pages/Home';

const Studio = lazy(() => import('@/pages/Studio'));
const Servizi = lazy(() => import('@/pages/Servizi'));
const Servizio = lazy(() => import('@/pages/Servizio'));
const Progetti = lazy(() => import('@/pages/Progetti'));
const Categoria = lazy(() => import('@/pages/Categoria'));
const Progetto = lazy(() => import('@/pages/Progetto'));
const Stampa = lazy(() => import('@/pages/Stampa'));
const StampaDettaglio = lazy(() => import('@/pages/StampaDettaglio'));
const Contatti = lazy(() => import('@/pages/Contatti'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Cookie = lazy(() => import('@/pages/Cookie'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  return (
    <>
      <SmoothScroll />
      <a href="#contenuto" className="sr-only z-[100] bg-white p-3 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Vai al contenuto
      </a>
      <Navbar />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          scrollToTop();
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }}
      >
        <PageTransition key={location.pathname}>
          <main id="contenuto">
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/servizi" element={<Servizi />} />
                <Route path="/servizi/:slug" element={<Servizio />} />
                <Route path="/progetti" element={<Progetti />} />
                <Route path="/progetti/:categoria" element={<Categoria />} />
                <Route path="/progetti/:categoria/:slug" element={<Progetto />} />
                <Route path="/rassegna-stampa" element={<Stampa />} />
                <Route path="/rassegna-stampa/:slug" element={<StampaDettaglio />} />
                <Route path="/contatti" element={<Contatti />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookie" element={<Cookie />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </PageTransition>
      </AnimatePresence>
    </>
  );
}
