import { LegalPage } from '@/components/layout/LegalPage';
import { privacy } from '@/data/legal';

export default function Privacy() {
  return <LegalPage title="Privacy" description="Informativa privacy del sito di RGR Architetti: quali dati trattiamo, perché e quali sono i Suoi diritti." sections={privacy} />;
}
