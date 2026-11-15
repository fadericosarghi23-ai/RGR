import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/form';
import { mapsQuery, phoneHref, site } from '@/data/content';
import { services } from '@/data/services';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export default function Contatti() {
  const [params] = useSearchParams();
  const pre = services.find((s) => s.slug === params.get('servizio'))?.title ?? '';
  const [status, setStatus] = useState<Status>('idle');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus('sending');
    const data = new FormData(form);
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Seo title="Contatti" description={`Contatti RGR Architetti: ${site.address.street}, ${site.address.cap} ${site.address.city}. Tel. ${site.phone}, ${site.email}.`} />
      <PageHeader kicker="Contatti" title={['Parliamo del', 'Suo progetto']} crumbs={[{ to: '/', label: 'Home' }]} />

      <section className="pb-24 lg:pb-32">
        <div className="container-rgr grid gap-16 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-4">
            <Reveal>
              <p className="label-tech !text-primary">Studio</p>
              <address className="mt-3 font-display text-2xl font-medium not-italic leading-snug text-rgr-black">
                {site.address.street}
                <br />
                {site.address.cap} {site.address.city}
              </address>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="label-tech !text-primary">Telefono</p>
              <a href={phoneHref} className="link-draw mt-2 inline-block py-1.5 font-display text-2xl font-medium text-rgr-black">
                {site.phone}
              </a>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="label-tech !text-primary">Email</p>
              <a href={`mailto:${site.email}`} className="link-draw mt-2 inline-block break-all py-1.5 font-display text-2xl font-medium text-rgr-black">
                {site.email}
              </a>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="label-tech !text-primary">Le architette</p>
              <ul className="mt-3 space-y-2">
                {site.partners.map((p) => (
                  <li key={p.email}>
                    <span className="block font-medium text-rgr-black">{p.name}</span>
                    <a href={`mailto:${p.email}`} className="inline-block break-all py-2 text-sm text-rgr-ink/80 hover:text-primary">
                      {p.email}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              {status === 'ok' ? (
                <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="paper-grid flex min-h-[420px] flex-col items-start justify-center border border-border p-10">
                  <svg viewBox="0 0 80 80" className="w-16" aria-hidden>
                    <motion.circle cx="40" cy="40" r="36" fill="none" stroke="var(--rgr-ink)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
                    <motion.path d="M24 41l11 11 22-24" fill="none" stroke="var(--rgr-red)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.7 }} />
                  </svg>
                  <h2 className="mt-8 font-display text-4xl font-bold uppercase">Messaggio inviato</h2>
                  <p className="mt-4 max-w-md text-rgr-ink/80">Grazie, lo studio Le risponderà al più presto.</p>
                  <button type="button" onClick={() => setStatus('idle')} className="link-draw mt-8 font-nav text-xs uppercase tracking-[0.18em]">
                    Scrivi un altro messaggio
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  name="contatti"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10"
                  noValidate
                >
                  <input type="hidden" name="form-name" value="contatti" />
                  <p className="hidden">
                    <label>
                      Non compilare: <input name="bot-field" />
                    </label>
                  </p>
                  <div className="grid gap-10 sm:grid-cols-2">
                    <Field label="Nome e cognome *">
                      <Input name="nome" required autoComplete="name" placeholder="Nome e cognome" />
                    </Field>
                    <Field label="Email *">
                      <Input name="email" type="email" required autoComplete="email" placeholder="Email" />
                    </Field>
                    <Field label="Telefono">
                      <Input name="telefono" type="tel" autoComplete="tel" placeholder="Telefono" />
                    </Field>
                    <Field label="Argomento">
                      <select name="servizio" defaultValue={pre} className="h-12 w-full border-0 border-b border-input bg-transparent px-0 text-base focus:border-primary focus:outline-none">
                        <option value="">Scelga un’area (facoltativo)</option>
                        {services.map((s) => (
                          <option key={s.slug} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Messaggio *">
                    <Textarea name="messaggio" required placeholder="Messaggio" />
                  </Field>
                  <label className="flex items-start gap-3 text-sm leading-relaxed text-rgr-ink/85">
                    <input type="checkbox" name="privacy" value="accettata" required className="mt-1 size-4 shrink-0 accent-[var(--rgr-red)]" />
                    <span>
                      Ho letto l’
                      <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                        informativa privacy
                      </Link>{' '}
                      e acconsento al trattamento dei miei dati per ricevere una risposta. *
                    </span>
                  </label>
                  <div className="flex flex-wrap items-center gap-6">
                    <Button type="submit" size="lg" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Invio in corso' : 'Invia il messaggio'} <ArrowRight />
                    </Button>
                    {status === 'error' && (
                      <p role="alert" className="text-sm text-primary">
                        Invio non riuscito. Può scrivere a{' '}
                        <a className="underline" href={`mailto:${site.email}`}>
                          {site.email}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <MapOnClick />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-tech block text-xs md:text-[0.68rem]">{label}</span>
      {children}
    </label>
  );
}

/** Mappa caricata solo dopo un clic: nessuna richiesta a Google prima del consenso. */
function MapOnClick() {
  const [on, setOn] = useState(false);
  return (
    <section aria-label="Mappa" className="relative">
      <div className={cn('paper-grid relative h-[460px] w-full overflow-hidden border-y border-border', on && 'bg-rgr-paper-2')}>
        {on ? (
          <iframe
            title="Mappa: RGR Architetti, Via Teodoro Frizzoni 22, Bergamo"
            src={`https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`}
            className="h-full w-full border-0 grayscale-[0.6]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
            <span className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <MapPin className="relative size-8 text-primary" />
            </span>
            <p className="max-w-md text-sm text-rgr-ink/80">
              La mappa è fornita da Google Maps, che può impostare cookie propri. La carichiamo solo se lo desidera.{' '}
              <Link to="/cookie" className="underline underline-offset-4">
                Cookie policy
              </Link>
            </p>
            <Button type="button" variant="outline" onClick={() => setOn(true)}>
              Mostra la mappa
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
