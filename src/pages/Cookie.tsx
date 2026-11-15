import { LegalPage } from '@/components/layout/LegalPage';
import { cookie } from '@/data/legal';

export default function Cookie() {
  return <LegalPage title="Cookie" description="Cookie policy del sito di RGR Architetti: nessun cookie di profilazione, mappa caricata solo su richiesta." sections={cookie} />;
}
